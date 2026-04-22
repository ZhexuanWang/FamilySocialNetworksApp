import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MembersService } from './members.service';
import { FamilyMember, Gender } from '../../entities';

const mockMemberRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('MembersService', () => {
  let service: MembersService;
  let repo: ReturnType<typeof mockMemberRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: getRepositoryToken(FamilyMember), useFactory: mockMemberRepo },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    repo = module.get(getRepositoryToken(FamilyMember));
  });

  describe('create', () => {
    it('creates a family member', async () => {
      const dto = { familyId: 'f1', name: 'Wang Er', generation: 2, gender: Gender.MALE };
      const created = { id: 'm1', ...dto };

      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('m1');
    });
  });

  describe('findByFamily', () => {
    it('returns members sorted by generation then name', async () => {
      const members = [
        { id: 'm1', name: 'Grandpa', generation: 1 },
        { id: 'm2', name: 'Parent', generation: 2 },
      ];
      repo.find.mockResolvedValue(members);

      const result = await service.findByFamily('f1');

      expect(repo.find).toHaveBeenCalledWith({ where: { familyId: 'f1' }, order: { generation: 'ASC', name: 'ASC' } });
      expect(result).toEqual(members);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when member not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates member fields', async () => {
      const member = { id: 'm1', name: 'Old Name', generation: 2 };
      repo.findOne.mockResolvedValue(member);
      repo.save.mockImplementation((m) => Promise.resolve(m));

      const result = await service.update('m1', { name: 'New Name' });

      expect(result.name).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('removes member from DB', async () => {
      repo.findOne.mockResolvedValue({ id: 'm1' });
      repo.remove.mockResolvedValue(undefined);

      await service.remove('m1');

      expect(repo.remove).toHaveBeenCalled();
    });
  });
});
