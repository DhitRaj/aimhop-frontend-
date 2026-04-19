/**
 * AimHop API Utility
 * Hardened Production API Client — with Next.js cache tags for revalidation
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
}

// ==================== Core Fetch Wrapper ====================

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {}
): Promise<ApiResponse<T>> {
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
    if (rawData && typeof rawData === 'object' && 'data' in rawData) {
      normalizedData = rawData.data;
    }

    return { data: normalizedData as T };
  } catch (err) {
    console.error('API Connection Error:', err);
    return { error: 'Could not connect to backend. Is the server running?' };
  }
}

// ==================== Auth APIs ====================

export const authAPI = {
  register: async (body: any) => apiFetch<any>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: async (body: any) => apiFetch<any>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: async () => apiFetch<{ message: string }>('/api/v1/auth/logout', { method: 'POST' }),
  me: async () => apiFetch<any>('/api/v1/auth/me'),
  updatePreferences: async (preferences: any) => apiFetch<any>('/api/v1/auth/preferences', { method: 'PATCH', body: JSON.stringify(preferences) }),
};

// ==================== Domain APIs ====================

export const contactAPI = {
  submit: (body: any) => apiFetch<any>('/api/v1/contact', { method: 'POST', body: JSON.stringify(body) }),
  getAll: () => apiFetch<any[]>('/api/v1/contact'),
  delete: (id: string) => apiFetch<any>(`/api/v1/contact/${id}`, { method: 'DELETE' }),
};

export const careerAPI = {
  submit: (formData: FormData) => apiFetch<any>('/api/v1/careers', { method: 'POST', body: formData }),
  getAll: () => apiFetch<any[]>('/api/v1/careers'),
  delete: (id: string) => apiFetch<any>(`/api/v1/careers/${id}`, { method: 'DELETE' }),
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
