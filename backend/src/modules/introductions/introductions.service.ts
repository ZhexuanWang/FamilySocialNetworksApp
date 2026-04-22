import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelfIntroduction } from '../../entities';
import { CreateSelfIntroductionDto, UpdateSelfIntroductionDto } from './dto';

@Injectable()
export class IntroductionsService {
  constructor(
    @InjectRepository(SelfIntroduction)
    private readonly introRepo: Repository<SelfIntroduction>,
  ) {}

  async upsert(dto: CreateSelfIntroductionDto): Promise<SelfIntroduction> {
    let intro = await this.introRepo.findOne({ where: { memberId: dto.memberId } });
    if (intro) {
      Object.assign(intro, dto);
    } else {
      intro = this.introRepo.create({ ...dto, tags: dto.tags ?? [] } as unknown as SelfIntroduction);
    }
    return this.introRepo.save(intro);
  }

  findByMember(memberId: string): Promise<SelfIntroduction | null> {
    return this.introRepo.findOne({ where: { memberId } });
  }

  async update(memberId: string, dto: UpdateSelfIntroductionDto): Promise<SelfIntroduction> {
    const intro = await this.findByMember(memberId);
    if (!intro) {
      throw new NotFoundException(`Introduction for member ${memberId} not found`);
    }
    Object.assign(intro, dto);
    return this.introRepo.save(intro);
  }

  async remove(memberId: string): Promise<void> {
    const intro = await this.findByMember(memberId);
    if (!intro) {
      throw new NotFoundException(`Introduction for member ${memberId} not found`);
    }
    await this.introRepo.remove(intro);
  }
}
