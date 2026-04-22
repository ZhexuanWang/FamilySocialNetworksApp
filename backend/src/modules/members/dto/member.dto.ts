import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Gender } from '../../../entities';

export class CreateMemberDto {
  @IsString()
  familyId: string;

  @IsOptional()
  userId?: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsInt()
  generation?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsInt()
  generation?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
