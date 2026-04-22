import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FamiliesModule } from './modules/families/families.module';
import { MembersModule } from './modules/members/members.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { IntroductionsModule } from './modules/introductions/introductions.module';
import {
  User,
  Family,
  FamilyMember,
  Relationship,
  Achievement,
  SelfIntroduction,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'fsna_user',
      password: process.env.DB_PASSWORD || 'fsna_password',
      database: process.env.DB_NAME || 'fsna_db',
      entities: [User, Family, FamilyMember, Relationship, Achievement, SelfIntroduction],
      synchronize: true,
    }),
    AuthModule,
    FamiliesModule,
    MembersModule,
    RelationshipsModule,
    AchievementsModule,
    IntroductionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
