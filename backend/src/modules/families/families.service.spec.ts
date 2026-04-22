import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { Family } from '../../entities';

const mockFamilyRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('FamiliesService', () => {
  let service: FamiliesService;
  let repo: ReturnType<typeof mockFamilyRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FamiliesService,
        { provide: getRepositoryToken(Family), useFactory: mockFamilyRepo },
      ],
    }).compile();

    service = module.get<FamiliesService>(FamiliesService);
    repo = module.get(getRepositoryToken(Family));
  });

  describe('create', () => {
    it('creates a family with the given user as creator', async () => {
      const dto = { name: 'Wang Family', description: 'desc' };
      const userId = 'user-uuid';
      const created = { id: 'family-uuid', ...dto, createdBy: userId };

      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(dto, userId);

      expect(repo.create).toHaveBeenCalledWith({ ...dto, createdBy: userId });
      expect(result).toEqual(created);
    });
  });

  describe('findOne', () => {
    it('returns family when found', async () => {
      const family = { id: 'family-uuid', name: 'Wang Family', createdBy: 'user-1' };
      repo.findOne.mockResolvedValue(family);

      const result = await service.findOne('family-uuid');

      expect(result).toEqual(family);
    });

    it('throws NotFoundException when not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('allows creator to update', async () => {
      const family = { id: 'family-uuid', name: 'Old Name', createdBy: 'user-1' };
      repo.findOne.mockResolvedValue(family);
      repo.save.mockImplementation((f) => Promise.resolve(f));

      const result = await service.update('family-uuid', { name: 'New Name' }, 'user-1');

      expect(result.name).toBe('New Name');
    });

    it('throws ForbiddenException for non-creator', async () => {
      repo.findOne.mockResolvedValue({ id: 'family-uuid', createdBy: 'user-1' });

      await expect(service.update('family-uuid', { name: 'New' }, 'other-user'))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('allows creator to delete', async () => {
      repo.findOne.mockResolvedValue({ id: 'family-uuid', createdBy: 'user-1' });
      repo.remove.mockResolvedValue(undefined);

      await expect(service.remove('family-uuid', 'user-1')).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalled();
    });

    it('throws ForbiddenException for non-creator', async () => {
      repo.findOne.mockResolvedValue({ id: 'family-uuid', createdBy: 'user-1' });

      await expect(service.remove('family-uuid', 'other-user'))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
