import { IsString, IsOptional, IsDateString, MaxLength } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  memberId: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}

export class UpdateAchievementDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
