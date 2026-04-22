import api from './api';
import type { Relationship, RelationType } from '../types';

export const relationshipsApi = {
  create: (data: {
    familyId: string;
    fromMemberId: string;
    toMemberId: string;
    relationType: RelationType;
  }) => api.post<Relationship>('/relationships', data),

  getByFamily: (familyId: string) =>
    api.get<Relationship[]>(`/relationships/family/${familyId}`),

  remove: (id: string) => api.delete(`/relationships/${id}`),
};
