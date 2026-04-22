import { IsString, IsEnum } from 'class-validator';
import { RelationType } from '../../../entities';

export class CreateRelationshipDto {
  @IsString()
  familyId: string;

  @IsString()
  fromMemberId: string;

  @IsString()
  toMemberId: string;

  @IsEnum(RelationType)
  relationType: RelationType;
}
