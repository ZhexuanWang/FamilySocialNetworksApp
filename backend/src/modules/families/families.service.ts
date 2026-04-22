import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from '../../entities';
import { CreateFamilyDto, UpdateFamilyDto } from './dto';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private readonly familyRepo: Repository<Family>,
  ) {}

  async create(dto: CreateFamilyDto, userId: string): Promise<Family> {
    const family = this.familyRepo.create({
      ...dto,
      createdBy: userId,
    });
    return this.familyRepo.save(family);
  }

  async findAll(): Promise<Family[]> {
    return this.familyRepo.find({
      relations: ['createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Family> {
    const family = await this.familyRepo.findOne({
      where: { id },
      relations: ['createdByUser', 'members'],
    });
    if (!family) {
      throw new NotFoundException(`Family ${id} not found`);
    }
    return family;
  }

  async update(id: string, dto: UpdateFamilyDto, userId: string): Promise<Family> {
    const family = await this.findOne(id);
    if (family.createdBy !== userId) {
      throw new ForbiddenException('Only the creator can update this family');
    }
    Object.assign(family, dto);
    return this.familyRepo.save(family);
  }

  async remove(id: string, userId: string): Promise<void> {
    const family = await this.findOne(id);
    if (family.createdBy !== userId) {
      throw new ForbiddenException('Only the creator can delete this family');
    }
    await this.familyRepo.remove(family);
  }
}
