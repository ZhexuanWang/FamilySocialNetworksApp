import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { IntroductionsService } from './introductions.service';
import { CreateSelfIntroductionDto, UpdateSelfIntroductionDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('introductions')
@UseGuards(JwtAuthGuard)
export class IntroductionsController {
  constructor(private readonly introductionsService: IntroductionsService) {}

  @Post()
  upsert(@Body() dto: CreateSelfIntroductionDto) {
    return this.introductionsService.upsert(dto);
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.introductionsService.findByMember(memberId);
  }

  @Patch('member/:memberId')
  update(@Param('memberId') memberId: string, @Body() dto: UpdateSelfIntroductionDto) {
    return this.introductionsService.update(memberId, dto);
  }

  @Delete('member/:memberId')
  remove(@Param('memberId') memberId: string) {
    return this.introductionsService.remove(memberId);
  }
}
