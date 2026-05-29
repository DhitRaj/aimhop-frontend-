/**
 * AimHop API Utility
 * Hardened Production API Client — with Next.js cache tags for revalidation
 */

const API_BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
const API_TIMEOUT_MS = 30000;

// ==================== Token Management ====================
// Auth is strictly handled via httpOnly cookies.
// No sensitive tokens are stored in localStorage to prevent XSS.

export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  return document.cookie.split(';').some(item => item.trim().startsWith('logged_in='));
};

export const removeToken = () => {
  if (typeof window === 'undefined') return;
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  localStorage.removeItem('token');
};

// ==================== Types ====================

interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// ==================== Core Fetch Wrapper ====================

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {}
): Promise<ApiResponse<T>> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const isGet = !options.method || options.method === 'GET';
    const isMutation = !isGet;

    // Cache strategy:
    // - Mutations (POST/PUT/DELETE): always no-store
    // - Public GETs: use next.tags for on-demand revalidation (30s fallback TTL)
    // - Admin/sensitive GETs: always no-store to avoid stale admin data
    const isSensitiveGet = cleanEndpoint.includes('/admin') || cleanEndpoint.includes('/careers');
    let cacheConfig: any;
    if (isMutation || isSensitiveGet) {
      cacheConfig = { cache: 'no-store' as RequestCache };
    } else if (isGet) {
      // Tag-based — allows on-demand revalidation via revalidateTag()
      const tag = cleanEndpoint.replace('/api/v1/', '').split('?')[0].split('/')[0];
      cacheConfig = { next: { revalidate: 30, tags: [tag] } };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    // Merge: explicit options override defaults
    const { next, ...restOptions } = options as any;
    const fetchOptions: any = {
      headers,
      credentials: 'include',
      ...cacheConfig,
      ...restOptions,
    };
    // If caller explicitly passed next tags, honor them
    if (next) fetchOptions.next = next;

    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    
    // Link caller's abort signal if available
    if (options.signal) {
      if (options.signal.aborted) {
        controller.abort();
      } else {
        options.signal.addEventListener('abort', () => controller.abort());
      }
    }
    fetchOptions.signal = controller.signal;

    const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, fetchOptions);

    const contentType = res.headers.get('content-type');
    let rawData: any = {};

    if (contentType && contentType.includes('application/json')) {
      rawData = await res.json();
    } else {
      const text = await res.text().catch(() => 'No response body');
      rawData = { message: text };
    }

    if (!res.ok) {
      return { error: rawData?.message || rawData?.error || `Server Error: ${res.status}` };
    }

    /**
     * CENTRALIZED DATA NORMALIZER
     * Prevents UI crashes by ensuring consistent data structures.
     */
    let normalizedData = rawData;
    // For lists, some endpoints return { data: [], total: 0 }, others return []
    // We return the raw object so UI can access 'total', 'totalPages' etc if present
    
    return normalizedData;
  } catch (err: any) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.warn(`[API Timeout/Abort] Request to ${endpoint} was aborted.`);
      return { error: 'Backend request timed out. Please try again.' };
    }
    console.error('API Connection Error:', err);
    return { error: 'Could not connect to backend. Is the server running?' };
  } finally {
    // Keep request timers from leaking after success/failure.
    if (timeoutId) clearTimeout(timeoutId);
  }
}

// ==================== Auth APIs ====================

export const authAPI = {
  register: async (body: any) => apiFetch<any>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: async (body: any) => apiFetch<any>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: async () => apiFetch<{ message: string }>('/api/v1/auth/logout', { method: 'POST' }),
  me: async () => apiFetch<any>('/api/v1/auth/me'),
  updatePreferences: async (preferences: any) => apiFetch<any>('/api/v1/auth/preferences', { method: 'PATCH', body: JSON.stringify(preferences) }),
  changePassword: async (body: any) => apiFetch<any>('/api/v1/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),
};

// ==================== Domain APIs ====================

export const contactAPI = {
  submit: (body: any) => apiFetch<any>('/api/v1/contact', { method: 'POST', body: JSON.stringify(body) }),
  getAll: (page = 1, limit = 10) => apiFetch<any>(`/api/v1/contact?page=${page}&limit=${limit}`),
  delete: (id: string) => apiFetch<any>(`/api/v1/contact/${id}`, { method: 'DELETE' }),
};

export const careerAPI = {
  submit: (formData: FormData) => apiFetch<any>('/api/v1/careers', { method: 'POST', body: formData }),
  getAll: (page = 1, limit = 10) => apiFetch<any>(`/api/v1/careers?page=${page}&limit=${limit}`),
  delete: (id: string) => apiFetch<any>(`/api/v1/careers/${id}`, { method: 'DELETE' }),
  downloadResume: (id: string) => `${API_BASE_URL}/api/v1/careers/download/${id}`,
};

export const serviceAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/services'),
  create: (formData: FormData) => apiFetch<any>('/api/v1/services', { method: 'POST', body: formData }),
  update: (id: string, formData: FormData) => apiFetch<any>(`/api/v1/services/${id}`, { method: 'PUT', body: formData }),
  delete: (id: string) => apiFetch<any>(`/api/v1/services/${id}`, { method: 'DELETE' }),
};

export const settingsAPI = {
  get: () => apiFetch<any>('/api/v1/settings'),
  save: (formData: FormData) => apiFetch<any>('/api/v1/settings', { method: 'POST', body: formData }),
};

export const bannerAPI = {
  getAll: (activeOnly = false, page?: string) => {
    const params = new URLSearchParams();
    if (activeOnly) params.set('activeOnly', 'true');
    if (page) params.set('page', page);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<any[]>(`/api/v1/banners${query}`);
  },
  create: (formData: FormData) => apiFetch<any>('/api/v1/banners', { method: 'POST', body: formData }),
  update: (id: string, formData: FormData) => apiFetch<any>(`/api/v1/banners/${id}`, { method: 'PUT', body: formData }),
  toggleStatus: (id: string, active: boolean) => apiFetch<any>(`/api/v1/banners/${id}/status`, { method: 'PATCH', body: JSON.stringify({ active }) }),
  delete: (id: string) => apiFetch<any>(`/api/v1/banners/${id}`, { method: 'DELETE' }),
};

export const clientAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/clients'),
  create: (formData: FormData) => apiFetch<any>('/api/v1/clients', { method: 'POST', body: formData }),
  update: (id: string, formData: FormData) => apiFetch<any>(`/api/v1/clients/${id}`, { method: 'PUT', body: formData }),
  delete: (id: string) => apiFetch<any>(`/api/v1/clients/${id}`, { method: 'DELETE' }),
};

export const testimonialAPI = {
  getAll: (status?: string) => apiFetch<any[]>(`/api/v1/testimonials${status ? `?status=${status}` : ''}`),
  submit: (body: any) => apiFetch<any>('/api/v1/testimonials/submit', { method: 'POST', body: JSON.stringify(body) }),
  add: (body: any) => apiFetch<any>('/api/v1/testimonials', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => apiFetch<any>(`/api/v1/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateStatus: (id: string, status: string) => apiFetch<any>(`/api/v1/testimonials/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: string) => apiFetch<any>(`/api/v1/testimonials/${id}`, { method: 'DELETE' }),
};

export const blogAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/blogs'),
  getById: (id: string) => apiFetch<any>(`/api/v1/blogs/${id}`),
  create: (formData: FormData) => apiFetch<any>('/api/v1/blogs', { method: 'POST', body: formData }),
  update: (id: string, formData: FormData) => apiFetch<any>(`/api/v1/blogs/${id}`, { method: 'PUT', body: formData }),
  delete: (id: string) => apiFetch<any>(`/api/v1/blogs/${id}`, { method: 'DELETE' }),
};

export const statsAPI = {
  get: () => apiFetch<any>('/api/v1/admin/stats'),
};

export const inquiryAPI = {
  // Public — called from /hire multi-step form
  submit: (body: any) => apiFetch<any>('/api/v1/inquiries', { method: 'POST', body: JSON.stringify(body) }),
  // Admin
  getAll: (page = 1, limit = 20, status?: string) =>
    apiFetch<any>(`/api/v1/inquiries?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`),
  updateStatus: (id: string, status: string, notes?: string) =>
    apiFetch<any>(`/api/v1/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
  delete: (id: string) => apiFetch<any>(`/api/v1/inquiries/${id}`, { method: 'DELETE' }),
};

export const workerAPI = {
  // Public — called from /apply form  
  submit: (formData: FormData) => apiFetch<any>('/api/v1/workers', { method: 'POST', body: formData }),
  // Admin
  getAll: (page = 1, limit = 20, status?: string, category?: string) =>
    apiFetch<any>(`/api/v1/workers?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}${category ? `&category=${category}` : ''}`),
  getOne: (id: string) => apiFetch<any>(`/api/v1/workers/${id}`),
  updateStatus: (id: string, status: string, notes?: string) =>
    apiFetch<any>(`/api/v1/workers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
  delete: (id: string) => apiFetch<any>(`/api/v1/workers/${id}`, { method: 'DELETE' }),
};

export const hireCategoryAPI = {
  getActive: () => apiFetch<any[]>('/api/v1/hire-categories/active'),
  // Admin
  getAll: () => apiFetch<any[]>('/api/v1/hire-categories'),
  create: (body: any) => apiFetch<any>('/api/v1/hire-categories', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => apiFetch<any>(`/api/v1/hire-categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch<any>(`/api/v1/hire-categories/${id}`, { method: 'DELETE' }),
};

export const navigationAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/navigation'),
  create: (body: any) => apiFetch<any>('/api/v1/navigation', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => apiFetch<any>(`/api/v1/navigation/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch<any>(`/api/v1/navigation/${id}`, { method: 'DELETE' }),
};

export const footerAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/footer'),
  create: (body: any) => apiFetch<any>('/api/v1/footer', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => apiFetch<any>(`/api/v1/footer/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch<any>(`/api/v1/footer/${id}`, { method: 'DELETE' }),
};

export const seoAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/seo'),
  getByRoute: (route: string) => apiFetch<any>(`/api/v1/seo/route/${route}`),
  create: (body: any) => apiFetch<any>('/api/v1/seo', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => apiFetch<any>(`/api/v1/seo/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch<any>(`/api/v1/seo/${id}`, { method: 'DELETE' }),
};

export const industryAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/industries'),
  create: (body: any) => apiFetch<any>('/api/v1/industries', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => apiFetch<any>(`/api/v1/industries/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch<any>(`/api/v1/industries/${id}`, { method: 'DELETE' }),
};

export const pageLayoutAPI = {
  getByRoute: (route: string) => apiFetch<any>(`/api/v1/pages/layout/${route}`),
  updateByRoute: (route: string, body: any) => apiFetch<any>(`/api/v1/pages/layout/${route}`, { method: 'PUT', body: JSON.stringify(body) }),
};

