import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Family } from './family.entity';
import { FamilyMember } from './family-member.entity';

export enum RelationType {
  PARENT = 'parent',
  CHILD = 'child',
  SPOUSE = 'spouse',
  SIBLING = 'sibling',
  GRANDPARENT = 'grandparent',
  GRANDCHILD = 'grandchild',
  UNCLE_AUNT = 'uncle_aunt',
  NEPHEW_NIECE = 'nephew_niece',
  OTHER = 'other',
}

@Entity('relationships')
export class Relationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'family_id' })
  familyId: string;

  @ManyToOne(() => Family, (family) => family.relationships)
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @Column({ name: 'from_member_id' })
  fromMemberId: string;

  @ManyToOne(() => FamilyMember, (member) => member.outgoingRelationships)
  @JoinColumn({ name: 'from_member_id' })
  fromMember: FamilyMember;

  @Column({ name: 'to_member_id' })
  toMemberId: string;

  @ManyToOne(() => FamilyMember, (member) => member.incomingRelationships)
  @JoinColumn({ name: 'to_member_id' })
  toMember: FamilyMember;

  @Column({
    name: 'relation_type',
    type: 'enum',
    enum: RelationType,
  })
  relationType: RelationType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
