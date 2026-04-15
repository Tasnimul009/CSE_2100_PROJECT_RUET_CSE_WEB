import axios from 'axios';

const TOKEN_KEY = 'ruet_admin_token';
const USER_KEY = 'ruet_admin_user';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = ({ token, admin }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (admin) localStorage.setItem(USER_KEY, JSON.stringify(admin));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const API_BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL
    || import.meta.env.VITE_STUDENT_API_BASE_URL
    || (import.meta.env.DEV ? 'http://localhost:5000/api' : ''),
).trim().replace(/\/+$/, '');

if (!API_BASE_URL) {
  console.warn('Missing VITE_API_BASE_URL/VITE_STUDENT_API_BASE_URL in production environment. API calls will use relative paths.');
}

const api = axios.create({
  baseURL: API_BASE_URL || undefined,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCollection = async (endpoint, params = {}) => (await api.get(endpoint, { params })).data;
export const createItem = async (endpoint, payload, isMultipart = false) =>
  (await api.post(endpoint, payload, { headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {} })).data;
export const updateItem = async (endpoint, id, payload, isMultipart = false) =>
  (await api.patch(`${endpoint}/${id}`, payload, { headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {} })).data;
export const deleteItem = async (endpoint, id) => (await api.delete(`${endpoint}/${id}`)).data;

export const loginAdmin = async (payload) => {
  const response = (await api.post('/auth/login', payload)).data;
  if (response?.data?.token) {
    setAuthSession(response.data);
  }
  return response;
};

export const getAdminProfile = async () => {
  const response = (await api.get('/auth/me')).data;
  if (response?.data) {
    setAuthSession({ token: getStoredToken(), admin: response.data });
  }
  return response;
};

export default api;
