import axios from 'axios';
import type { Orden } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },
};

export const ordenesAPI = {
  getAll: async () => {
    const response = await api.get<Orden[]>('/ordenes');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Orden>(`/ordenes/${id}`);
    return response.data;
  },

  search: async (filters: {
    folio?: string;
    cliente?: string;
    placa?: string;
    estado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }) => {
    const response = await api.get<Orden[]>('/ordenes/search', { params: filters });
    return response.data;
  },

  create: async (orden: Omit<Orden, 'id' | 'folio' | 'estado' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    const response = await api.post<Orden>('/ordenes', orden);
    return response.data;
  },

  update: async (id: string, orden: Partial<Orden>) => {
    const response = await api.put<Orden>(`/ordenes/${id}`, orden);
    return response.data;
  },

  updateEstado: async (id: string, estado: string) => {
    const response = await api.patch<Orden>(`/ordenes/${id}/estado`, { estado });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/ordenes/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/ordenes/stats');
    return response.data;
  },
};

export default api;
