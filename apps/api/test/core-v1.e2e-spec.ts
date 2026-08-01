import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CreatorOS Core V1 (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters';
    process.env.CREATOROS_ADMIN_USERNAME = 'admin';
    process.env.CREATOROS_ADMIN_PASSWORD = 'password123';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('exposes liveness', async () => {
    await request(app.getHttpServer())
      .get('/health/live')
      .expect(200);
  });

  it('issues a bootstrap JWT', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'password123',
      })
      .expect(201);
  });
});