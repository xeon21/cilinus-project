import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  const testUserIdx = 18; // User 'test'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Get admin token
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminLoginResponse.body.accessToken;

    // Get regular user token
    const userLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test', password: '1234' });
    userToken = userLoginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/admin/users (GET)', () => {
    // ... (previous tests)
  });

  describe('/admin/users/:userIdx/role (PATCH)', () => {
    // ... (previous tests)
  });

  describe('/admin/users/:userIdx (DELETE)', () => {
    const userToDeleteIdx = 18; // User 'test'

    it('should forbid deletion for non-admin users', () => {
      return request(app.getHttpServer())
        .delete(`/admin/users/${userToDeleteIdx}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 404 for a non-existent user', () => {
      const nonExistentUserId = 9999;
      return request(app.getHttpServer())
        .delete(`/admin/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
    
    // This test is destructive and should run last or with a proper db reset strategy.
    it('should successfully delete a user for admin', () => {
      return request(app.getHttpServer())
        .delete(`/admin/users/${userToDeleteIdx}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200); // Or 204
    });
  });
});

