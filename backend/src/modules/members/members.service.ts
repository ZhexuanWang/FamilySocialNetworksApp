import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyMember } from '../../entities';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(FamilyMember)
    private readonly memberRepo: Repository<FamilyMember>,
  ) {}

  create(dto: CreateMemberDto): Promise<FamilyMember> {
    const member = this.memberRepo.create(dto as unknown as FamilyMember);
    return this.memberRepo.save(member);
  }

  findByFamily(familyId: string): Promise<FamilyMember[]> {
    return this.memberRepo.find({
      where: { familyId },
      order: { generation: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<FamilyMember> {
    const member = await this.memberRepo.findOne({
      where: { id },
      relations: ['achievements', 'introductions'],
    });
    if (!member) {
      throw new NotFoundException(`Member ${id} not found`);
    }
    return member;
  }

  async update(id: string, dto: UpdateMemberDto): Promise<FamilyMember> {
    const member = await this.findOne(id);
    Object.assign(member, dto);
    return this.memberRepo.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findOne(id);
    await this.memberRepo.remove(member);
  }
}
