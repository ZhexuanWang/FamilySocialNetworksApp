import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Families (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const randomEmail = `family_${Date.now()}@test.com`;

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

    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: randomEmail, password: 'password123' });
    token = registerRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/families (POST)', () => {
    it('creates a family with valid token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/families')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Family', description: 'Test desc' })
        .expect(201);

      expect(res.body.name).toBe('Test Family');
      expect(res.body.id).toBeDefined();
    });

    it('returns 401 without token', async () => {
      await request(app.getHttpServer())
        .post('/api/families')
        .send({ name: 'Test' })
        .expect(401);
    });
  });

  describe('/api/families (GET)', () => {
    it('returns families list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/families')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('/api/families/:id (PATCH)', () => {
    it('updates family by creator', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/families')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Original Name' });

      const familyId = createRes.body.id;

      await request(app.getHttpServer())
        .patch(`/api/families/${familyId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' })
        .expect(200);
    });
  });
});
