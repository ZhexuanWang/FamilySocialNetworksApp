import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SelfIntroduction } from '../../entities';
import { IntroductionsController } from './introductions.controller';
import { IntroductionsService } from './introductions.service';

@Module({
  imports: [TypeOrmModule.forFeature([SelfIntroduction])],
  controllers: [IntroductionsController],
  providers: [IntroductionsService],
  exports: [IntroductionsService],
})
export class IntroductionsModule {}
