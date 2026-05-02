import axios from 'axios';

function extractApiMessage(error) {
  const data = error.response?.data;
  if (typeof data === 'string') return data;
  if (data?.detail) {
    return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
  }
  if (data?.message) return data.message;
  if (data && typeof data === 'object') {
    const key = Object.keys(data)[0];
    if (key && Array.isArray(data[key])) return `${key}: ${data[key][0]}`;
  }
  if (error.code === 'ECONNABORTED') return 'Request timed out.';
  if (error.message === 'Network Error') {
    return 'Network error — unable to reach the server.';
  }
  if (!error.response) return error.message || 'Request failed';
  return `Request failed (${error.response.status})`;
}

/**
 * Single HTTP client for the Django API. Uses relative `/api` so the browser
 * stays on HTTPS; Vercel rewrites (prod) or Vite proxy (dev) forward to the backend.
 */
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.apiMessage = extractApiMessage(error);
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error) {
  return error?.apiMessage ?? extractApiMessage(error);
}
