import api from './api';
import type { Family } from '../types';

export const familiesApi = {
  getAll: () => api.get<Family[]>('/families'),

  getOne: (id: string) => api.get<Family>(`/families/${id}`),

  create: (data: { name: string; description?: string }) =>
    api.post<Family>('/families', data),

  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch<Family>(`/families/${id}`, data),

  remove: (id: string) => api.delete(`/families/${id}`),
};
