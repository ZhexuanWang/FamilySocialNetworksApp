import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { Relationship, RelationType } from '../../entities';

const mockRelRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('RelationshipsService', () => {
  let service: RelationshipsService;
  let repo: ReturnType<typeof mockRelRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationshipsService,
        { provide: getRepositoryToken(Relationship), useFactory: mockRelRepo },
      ],
    }).compile();

    service = module.get<RelationshipsService>(RelationshipsService);
    repo = module.get(getRepositoryToken(Relationship));
  });

  describe('create', () => {
    it('creates a relationship between two different members', async () => {
      const dto = {
        familyId: 'f1',
        fromMemberId: 'm1',
        toMemberId: 'm2',
        relationType: RelationType.PARENT,
      };
      const created = { id: 'r1', ...dto };
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result.id).toBe('r1');
    });

    it('throws BadRequestException when member relates to themselves', async () => {
      const dto = {
        familyId: 'f1',
        fromMemberId: 'm1',
        toMemberId: 'm1',
        relationType: RelationType.PARENT,
      };

      expect(() => service.create(dto)).toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when relationship not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes the relationship', async () => {
      repo.findOne.mockResolvedValue({ id: 'r1' });
      repo.remove.mockResolvedValue(undefined);

      await service.remove('r1');

      expect(repo.remove).toHaveBeenCalled();
    });
  });
});
