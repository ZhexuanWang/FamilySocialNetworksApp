export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Family {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdByUser?: User;
  createdAt: string;
  updatedAt: string;
  members?: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  familyId: string;
  userId?: string;
  name: string;
  generation: number;
  gender: Gender;
  birthDate?: string;
  avatarUrl?: string;
  bio?: string;
  achievements?: Achievement[];
  introductions?: SelfIntroduction[];
}

export interface Achievement {
  id: string;
  memberId: string;
  title: string;
  description?: string;
  date?: string;
  category?: string;
}

export interface SelfIntroduction {
  id: string;
  memberId: string;
  content?: string;
  tags?: string[];
}

export type Gender = 'male' | 'female' | 'other';

export type RelationType =
  | 'parent'
  | 'child'
  | 'spouse'
  | 'sibling'
  | 'grandparent'
  | 'grandchild'
  | 'uncle_aunt'
  | 'nephew_niece'
  | 'other';

export interface Relationship {
  id: string;
  familyId: string;
  fromMemberId: string;
  toMemberId: string;
  relationType: RelationType;
}
