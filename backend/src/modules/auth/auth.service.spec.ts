import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../../entities';

const mockUserRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: ReturnType<typeof mockUserRepo>;
  let jwtService: ReturnType<typeof mockJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('creates a new user when email is not taken', async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({ id: 'uuid-1', email: 'test@test.com' });
      userRepo.save.mockResolvedValue({ id: 'uuid-1', email: 'test@test.com' });
      jwtService.sign.mockReturnValue('token');

      const result = await service.register({ email: 'test@test.com', password: 'password123' });

      expect(result.accessToken).toBe('token');
      expect(userRepo.save).toHaveBeenCalled();
    });

    it('throws ConflictException when email is already taken', async () => {
      userRepo.findOne.mockResolvedValue({ id: 'existing', email: 'test@test.com' });

      await expect(service.register({ email: 'test@test.com', password: 'password123' }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('returns token for valid credentials', async () => {
      const hash = await bcrypt.hash('password123', 10);
      userRepo.findOne.mockResolvedValue({ id: 'uuid-1', email: 'test@test.com', passwordHash: hash });
      jwtService.sign.mockReturnValue('token');

      const result = await service.login({ email: 'test@test.com', password: 'password123' });

      expect(result.accessToken).toBe('token');
    });

    it('throws UnauthorizedException for unknown email', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.login({ email: 'unknown@test.com', password: 'password123' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('correct-password', 10);
      userRepo.findOne.mockResolvedValue({ id: 'uuid-1', email: 'test@test.com', passwordHash: hash });

      await expect(service.login({ email: 'test@test.com', password: 'wrong-password' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('returns user when found', async () => {
      userRepo.findOne.mockResolvedValue({ id: 'uuid-1', email: 'test@test.com' });

      const result = await service.validateUser('uuid-1');

      expect(result).toEqual({ id: 'uuid-1', email: 'test@test.com' });
    });

    it('returns null when not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent');

      expect(result).toBeNull();
    });
  });
});
