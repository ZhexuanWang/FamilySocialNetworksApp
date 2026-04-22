import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { CreateRelationshipDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('relationships')
@UseGuards(JwtAuthGuard)
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Post()
  create(@Body() dto: CreateRelationshipDto) {
    return this.relationshipsService.create(dto);
  }

  @Get('family/:familyId')
  findByFamily(@Param('familyId') familyId: string) {
    return this.relationshipsService.findByFamily(familyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relationshipsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relationshipsService.remove(id);
  }
}
