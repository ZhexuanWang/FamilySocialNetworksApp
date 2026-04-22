import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FamilyMember } from './family-member.entity';

@Entity('self_introductions')
export class SelfIntroduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_id' })
  memberId: string;

  @ManyToOne(() => FamilyMember, (member) => member.introductions)
  @JoinColumn({ name: 'member_id' })
  member: FamilyMember;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
