import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: async (username, email, password, confirmPassword) => {
    const response = await api.post('/auth/signup', {
      username,
      email,
      password,
      confirmPassword
    });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const ideaService = {
  getAll: async () => {
    const response = await api.get('/ideas');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/ideas/${id}`);
    return response.data;
  },
  create: async (idea) => {
    const response = await api.post('/ideas', idea);
    return response.data;
  },
  update: async (id, idea) => {
    const response = await api.put(`/ideas/${id}`, idea);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/ideas/${id}`);
    return response.data;
  }
};

export default api;