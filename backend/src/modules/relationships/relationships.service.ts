import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Relationship, RelationType } from '../../entities';
import { CreateRelationshipDto } from './dto';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(Relationship)
    private readonly relRepo: Repository<Relationship>,
  ) {}

  create(dto: CreateRelationshipDto): Promise<Relationship> {
    if (dto.fromMemberId === dto.toMemberId) {
      throw new BadRequestException('A member cannot have a relationship with themselves');
    }
    const rel = this.relRepo.create(dto as unknown as Relationship);
    return this.relRepo.save(rel);
  }

  findByFamily(familyId: string): Promise<Relationship[]> {
    return this.relRepo.find({
      where: { familyId },
      relations: ['fromMember', 'toMember'],
    });
  }

  async findOne(id: string): Promise<Relationship> {
    const rel = await this.relRepo.findOne({
      where: { id },
      relations: ['fromMember', 'toMember'],
    });
    if (!rel) {
      throw new NotFoundException(`Relationship ${id} not found`);
    }
    return rel;
  }

  async remove(id: string): Promise<void> {
    const rel = await this.findOne(id);
    await this.relRepo.remove(rel);
  }

  async getFamilyTree(familyId: string) {
    const relationships = await this.findByFamily(familyId);
    return { nodes: [], links: relationships.map((r) => ({ source: r.fromMemberId, target: r.toMemberId, type: r.relationType })) };
  }
}
