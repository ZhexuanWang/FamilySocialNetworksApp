import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Family } from './family.entity';
import { User } from './user.entity';
import { Relationship } from './relationship.entity';
import { Achievement } from './achievement.entity';
import { SelfIntroduction } from './self-introduction.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('family_members')
export class FamilyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'family_id' })
  familyId: string;

  @ManyToOne(() => Family, (family) => family.members)
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @Column({ name: 'user_id', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.familyMembers, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'int', default: 1 })
  generation: number;

  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Relationship, (rel) => rel.fromMember)
  outgoingRelationships: Relationship[];

  @OneToMany(() => Relationship, (rel) => rel.toMember)
  incomingRelationships: Relationship[];

  @OneToMany(() => Achievement, (achievement) => achievement.member)
  achievements: Achievement[];

  @OneToMany(() => SelfIntroduction, (intro) => intro.member)
  introductions: SelfIntroduction[];
}
