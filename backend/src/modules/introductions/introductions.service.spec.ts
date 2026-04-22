import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { IntroductionsService } from './introductions.service';
import { SelfIntroduction } from '../../entities';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('IntroductionsService', () => {
  let service: IntroductionsService;
  let repo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntroductionsService,
        { provide: getRepositoryToken(SelfIntroduction), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<IntroductionsService>(IntroductionsService);
    repo = module.get(getRepositoryToken(SelfIntroduction));
  });

  describe('upsert', () => {
    it('creates introduction when none exists', async () => {
      const dto = { memberId: 'm1', content: 'Hello, I am a Wang family member.', tags: ['hobby'] };
      const created = { id: 'i1', ...dto };
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.upsert(dto);

      expect(result.id).toBe('i1');
      expect(repo.create).toHaveBeenCalled();
    });

    it('updates introduction when one already exists', async () => {
      const existing = { id: 'i1', memberId: 'm1', content: 'Old content', tags: [] };
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockImplementation((i) => Promise.resolve(i));

      const result = await service.upsert({ memberId: 'm1', content: 'New content' });

      expect(result.content).toBe('New content');
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates existing introduction', async () => {
      repo.findOne.mockResolvedValue({ id: 'i1', memberId: 'm1', content: 'Old', tags: [] });
      repo.save.mockImplementation((i) => Promise.resolve(i));

      const result = await service.update('m1', { content: 'Updated content' });

      expect(result.content).toBe('Updated content');
    });

    it('throws NotFoundException when no introduction exists', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update('m1', { content: 'New' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes introduction', async () => {
      repo.findOne.mockResolvedValue({ id: 'i1' });
      repo.remove.mockResolvedValue(undefined);

      await service.remove('m1');

      expect(repo.remove).toHaveBeenCalled();
    });

    it('throws NotFoundException when no introduction exists', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.remove('m1')).rejects.toThrow(NotFoundException);
    });
  });
});
