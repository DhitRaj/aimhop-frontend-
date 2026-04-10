/**
 * AimHop API Utility
 * Used to connect the Frontend to the Backend
 * Base URL comes from .env.local
 */

// Uses Next.js rewrites (next.config.ts) to proxy to backend
// Browser calls localhost:3000/api/... → Next.js forwards to localhost:5000/api/...
// This permanently eliminates all CORS issues.
const API_BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');


// ==================== Token Management (Moved to Top) ====================

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('aimhop_token');
  }
  return null;
};

export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aimhop_token', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('aimhop_token');
  }
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const getAuthHeader = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
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
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...getAuthHeader(),
        ...(options.headers as Record<string, string>),
      },
      cache: 'no-store', // Crucial for Next.js and fresh admin data
      ...options,
    });

    const contentType = res.headers.get('content-type');
    let data: any = {};
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch (e) {
        console.error('JSON Parse Error:', e);
        // Fallback if it claimed to be JSON but wasn't
        const text = await res.text().catch(() => '');
        data = { message: text || 'Invalid JSON response from server' };
      }
    } else {
      // Handle non-JSON response (like rate limit plain text)
      const text = await res.text().catch(() => 'No response body');
      data = { message: text };
    }

    if (!res.ok) {
      return { error: data?.message || data?.error || `Server Error: ${res.status}` };
    }

    return { data };
  } catch (err) {
    console.error('API Connection Error:', err);
    return { error: 'Could not connect to backend. Is the server running?' };
  }
}

// ==================== Health Check ====================

export const checkBackendHealth = async () => {
  return apiFetch<{ status: string; timestamp: string }>('/health');
};

// ==================== Auth APIs ====================

export const authAPI = {
  register: async (body: { name: string; email: string; password: string; phone: string }) => {
    return apiFetch<{ token: string; user: { id: string; name: string; email: string } }>(
      '/api/v1/auth/register',
      { method: 'POST', body: JSON.stringify(body) }
    );
  },

  login: async (body: { email: string; password: string }) => {
    return apiFetch<{ token: string; user: { id: string; name: string; email: string } }>(
      '/api/v1/auth/login',
      { method: 'POST', body: JSON.stringify(body) }
    );
  },
};

// ==================== Contact API ====================

export const contactAPI = {
  submit: async (body: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    return apiFetch<{ message: string }>('/api/v1/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  getAll: async () => apiFetch<any[]>('/api/v1/contact'),

  delete: (id: string) => apiFetch<any>(`/api/v1/contact/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== Career API ====================
 
export const careerAPI = {
  submit: (formData: FormData) => {
    return fetch(`/api/v1/careers`, {
      method: 'POST',
      body: formData,
    }).then(async (res) => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json().catch(() => ({})) : { message: await res.text().catch(() => 'Error body') };
      return res.ok ? { data } : { error: data.message };
    });
  },

  getAll: () => apiFetch<any[]>('/api/v1/careers'),

  delete: (id: string) => apiFetch<any>(`/api/v1/careers/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== Service API ====================

export const serviceAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/services'),
  create: (formData: FormData) => 
    fetch(`/api/v1/services`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(async (res) => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : { message: 'Unexpected response from server' };
      return res.ok ? { data } : { error: data.message || `Error ${res.status}` };
    }),
  update: (id: string, formData: FormData) =>
    fetch(`/api/v1/services/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(async (res) => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : { message: 'Unexpected response from server' };
      return res.ok ? { data } : { error: data.message || `Error ${res.status}` };
    }),
  delete: (id: string) => apiFetch<any>(`/api/v1/services/${id}`, { 
    method: 'DELETE',
  }),
};

// ==================== Settings API ====================

export const settingsAPI = {
  get: () => apiFetch<any>('/api/v1/settings'),
  save: (formData: FormData) => {
    return fetch(`/api/v1/settings`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(async (res) => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json().catch(() => ({})) : { message: await res.text().catch(() => 'Error body') };
      return res.ok ? { data } : { error: data.message };
    });
  },
};

// ==================== Banner API ====================
export const bannerAPI = {
  getAll: (activeOnly = false, page?: string) => {
    const params = new URLSearchParams();
    if (activeOnly) params.set('activeOnly', 'true');
    if (page) params.set('page', page);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<any[]>(`/api/v1/banners${query}`);
  },
  create: (formData: FormData) => 
    fetch(`${API_BASE_URL}/api/v1/banners`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(async (res) => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : { message: 'Unexpected response' };
      return res.ok ? { data } : { error: data.message };
    }),
  update: (id: string, formData: FormData) =>
    fetch(`${API_BASE_URL}/api/v1/banners/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(async (res) => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : { message: 'Unexpected response' };
      return res.ok ? { data } : { error: data.message };
    }),
  toggleStatus: (id: string, active: boolean) => apiFetch<any>(`/api/v1/banners/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  }),
  delete: (id: string) => apiFetch<any>(`/api/v1/banners/${id}`, { 
    method: 'DELETE'
  }),
};

// ==================== Client API ====================
export const clientAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/clients'),
  create: (formData: FormData) => 
    fetch(`/api/v1/clients`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(async (res) => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : { message: 'Unexpected response' };
      return res.ok ? { data } : { error: data.message };
    }),
  delete: (id: string) => apiFetch<any>(`/api/v1/clients/${id}`, { 
    method: 'DELETE'
  }),
};

// ==================== Testimonial API ====================
export const testimonialAPI = {
  getAll: (status?: string) => apiFetch<any[]>(`/api/v1/testimonials${status ? `?status=${status}` : ''}`),
  submit: (body: any) => apiFetch<any>('/api/v1/testimonials/submit', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  add: (body: any) => apiFetch<any>('/api/v1/testimonials', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  update: (id: string, body: any) => apiFetch<any>(`/api/v1/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  delete: (id: string) => apiFetch<any>(`/api/v1/testimonials/${id}`, { 
    method: 'DELETE',
  }),
};

// ==================== Blog API ====================
export const blogAPI = {
  getAll: () => apiFetch<any[]>('/api/v1/blogs'),
  getById: (id: string) => apiFetch<any>(`/api/v1/blogs/${id}`),
  create: (formData: FormData) => {
    return fetch(`/api/v1/blogs`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(async (res) => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : { message: 'Unexpected response' };
      return res.ok ? { data: data.blog || data } : { error: data.message };
    });
  },
  update: (id: string, formData: FormData) => {
    return fetch(`/api/v1/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(async (res) => {
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : { message: 'Unexpected response' };
      return res.ok ? { data: data.blog || data } : { error: data.message };
    });
  },
  delete: (id: string) => apiFetch<any>(`/api/v1/blogs/${id}`, { 
    method: 'DELETE'
  }),
};

// ==================== Stats API ====================

export const statsAPI = {
  get: async () => {
    return apiFetch<any>('/api/v1/admin/stats');
  },
};


export default apiFetch;
