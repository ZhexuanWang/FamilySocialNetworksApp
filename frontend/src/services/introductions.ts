import api from './api';
import type { SelfIntroduction } from '../types';

export const introductionsApi = {
  upsert: (data: { memberId: string; content?: string; tags?: string[] }) =>
    api.post<SelfIntroduction>('/introductions', data),

  getByMember: (memberId: string) =>
    api.get<SelfIntroduction>(`/introductions/member/${memberId}`),

  update: (memberId: string, data: { content?: string; tags?: string[] }) =>
    api.patch<SelfIntroduction>(`/introductions/member/${memberId}`, data),

  remove: (memberId: string) =>
    api.delete(`/introductions/member/${memberId}`),
};
