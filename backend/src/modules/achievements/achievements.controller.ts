import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  create(@Body() dto: CreateAchievementDto) {
    return this.achievementsService.create(dto);
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.achievementsService.findByMember(memberId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAchievementDto) {
    return this.achievementsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(id);
  }
}
