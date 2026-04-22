import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { Achievement } from '../../entities';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('AchievementsService', () => {
  let service: AchievementsService;
  let repo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsService,
        { provide: getRepositoryToken(Achievement), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
    repo = module.get(getRepositoryToken(Achievement));
  });

  describe('create', () => {
    it('creates an achievement', async () => {
      const dto = { memberId: 'm1', title: 'First Place', category: 'academic' };
      const created = { id: 'a1', ...dto };
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result.id).toBe('a1');
      expect(result.title).toBe('First Place');
    });
  });

  describe('findByMember', () => {
    it('returns achievements sorted by date desc', async () => {
      const achievements = [
        { id: 'a1', title: 'Recent', date: '2024-01-01' },
        { id: 'a2', title: 'Older', date: '2023-01-01' },
      ];
      repo.find.mockResolvedValue(achievements);

      const result = await service.findByMember('m1');

      expect(repo.find).toHaveBeenCalledWith({ where: { memberId: 'm1' }, order: { date: 'DESC', createdAt: 'DESC' } });
      expect(result).toEqual(achievements);
    });
  });

  describe('update', () => {
    it('updates achievement fields', async () => {
      repo.findOne.mockResolvedValue({ id: 'a1', title: 'Old' });
      repo.save.mockImplementation((a) => Promise.resolve(a));

      const result = await service.update('a1', { title: 'New Title' });

      expect(result.title).toBe('New Title');
    });

    it('throws NotFoundException for unknown id', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update('nonexistent', { title: 'New' })).rejects.toThrow(NotFoundException);
    });
  });
});
