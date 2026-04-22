import api from './api';
import type { FamilyMember } from '../types';

export const membersApi = {
  create: (data: {
    familyId: string;
    name: string;
    generation?: number;
    gender?: string;
    birthDate?: string;
    avatarUrl?: string;
    bio?: string;
  }) => api.post<FamilyMember>('/members', data),

  getByFamily: (familyId: string) =>
    api.get<FamilyMember[]>(`/members/family/${familyId}`),

  getOne: (id: string) =>
    api.get<FamilyMember>(`/members/${id}`),

  update: (id: string, data: Partial<FamilyMember>) =>
    api.patch<FamilyMember>(`/members/${id}`, data),

  remove: (id: string) => api.delete(`/members/${id}`),
};
