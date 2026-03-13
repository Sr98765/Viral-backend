import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Viral Backend (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register test user
    await request(app.getHttpServer())
      .post('/user/register')
      .send({ email: 'e2euser@viral.com', password: '123456' });

    // Login and store JWT token
    const loginRes = await request(app.getHttpServer())
      .post('/user/login')
      .send({ email: 'e2euser@viral.com', password: '123456' });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Root Endpoint', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Wallet Endpoints', () => {
    it('/wallet/deposit (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/wallet/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send({ amount: 500 });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('balance');
      expect(res.body.balance).toBeGreaterThanOrEqual(500);
    });

    it('/wallet/balance (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/wallet/balance')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('balance');
      expect(res.body.balance).toBeGreaterThanOrEqual(500);
    });

    it('/wallet/withdraw (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/wallet/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .send({ amount: 200 });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('balance');
      expect(res.body.balance).toBeGreaterThanOrEqual(300);
    });
  });

  describe('Game Endpoint', () => {
    it('/game/play (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/game/play')
        .set('Authorization', `Bearer ${token}`)
        .send({ betAmount: 100, seed: 'e2e-test-seed' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('result');
      expect(res.body).toHaveProperty('won');
      expect(res.body).toHaveProperty('payout');
    });
  });
});