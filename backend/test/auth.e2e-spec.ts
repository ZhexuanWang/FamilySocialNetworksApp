import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const randomEmail = `test_${Date.now()}@test.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/auth/register (POST)', () => {
    it('registers a new user and returns accessToken', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: randomEmail, password: 'password123' })
        .expect(201);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe(randomEmail);
    });

    it('returns 409 Conflict for duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: randomEmail, password: 'password123' });

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: randomEmail, password: 'password123' })
        .expect(409);
    });

    it('returns 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'not-an-email', password: 'password123' })
        .expect(400);
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('logs in with valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: randomEmail, password: 'password123' })
        .expect(201);

      expect(res.body.accessToken).toBeDefined();
    });

    it('returns 401 for wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: randomEmail, password: 'wrongpassword' })
        .expect(401);
    });

    it('returns 401 for unknown email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'unknown@test.com', password: 'password123' })
        .expect(401);
    });
  });

  describe('/api/auth (protected endpoints)', () => {
    it('returns 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/api/families')
        .expect(401);
    });
  });
});
