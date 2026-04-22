import api from './api';
import type { Achievement } from '../types';

export const achievementsApi = {
  getByMember: (memberId: string) =>
    api.get<Achievement[]>(`/achievements/member/${memberId}`),

  create: (data: {
    memberId: string;
    title: string;
    description?: string;
    date?: string;
    category?: string;
  }) => api.post<Achievement>('/achievements', data),

  update: (id: string, data: Partial<Achievement>) =>
    api.patch<Achievement>(`/achievements/${id}`, data),

  remove: (id: string) => api.delete(`/achievements/${id}`),
};
