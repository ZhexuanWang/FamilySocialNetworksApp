import { IsString, IsOptional } from 'class-validator';

export class CreateSelfIntroductionDto {
  @IsString()
  memberId: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  tags?: string[];
}

export class UpdateSelfIntroductionDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  tags?: string[];
}
