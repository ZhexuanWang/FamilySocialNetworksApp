import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../../entities';
import { CreateAchievementDto, UpdateAchievementDto } from './dto';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,
  ) {}

  create(dto: CreateAchievementDto): Promise<Achievement> {
    const achievement = this.achievementRepo.create(dto as unknown as Achievement);
    return this.achievementRepo.save(achievement);
  }

  findByMember(memberId: string): Promise<Achievement[]> {
    return this.achievementRepo.find({
      where: { memberId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Achievement> {
    const achievement = await this.achievementRepo.findOne({ where: { id } });
    if (!achievement) {
      throw new NotFoundException(`Achievement ${id} not found`);
    }
    return achievement;
  }

  async update(id: string, dto: UpdateAchievementDto): Promise<Achievement> {
    const achievement = await this.findOne(id);
    Object.assign(achievement, dto);
    return this.achievementRepo.save(achievement);
  }

  async remove(id: string): Promise<void> {
    const achievement = await this.findOne(id);
    await this.achievementRepo.remove(achievement);
  }
}
