import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { UserAuthService } from 'src/user/application/service/user-auth.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const password = 'password123';
  let ownerToken;
  let customerToken;
  let driverToken;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const userAuthService = moduleFixture.get(UserAuthService);
    app.use((req, res, next) => {
      req['userAuthService'] = userAuthService;
      next();
    });
    await app.init();
  });

  it('should sign up a new owner', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/user/owner')
      .send({
        email: 'owner@example.com',
        password,
        role: 'Owner',
      })
      .expect(201);

    expect(res.text).toBe('true'); // ✅ correct way

    // expect(res.body).toHaveProperty('id');
    // expect(res.body.email).toBe('owner@example.com');
  });

  it('should sign up a new customer', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/user/customer')
      .send({
        email: 'client@example.com',
        password,
        role: 'Client',
        deliveryAddress: '123 Main St, City, Country',
      })
      .expect(201);

    expect(res.text).toBe('true'); // ✅ correct way
  });

  it('should sign up a new driver', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/user/driver')
      .send({
        email: 'driver@example.com',
        password,
        role: 'Delivery',
      })
      .expect(201);

    expect(res.text).toBe('true'); // ✅ correct way
  });

  it('should log in the owner and return access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'owner@example.com',
        password,
      })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    ownerToken = res.body.token; // Store the token for further tests
  });

  it('should log in the customer and return access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'client@example.com',
        password,
      })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    customerToken = res.body.token; // Store the token for further tests
  });

  it('should log in the driver and return access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'driver@example.com',
        password,
      })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    driverToken = res.body.token; // Store the token for further tests
  });

  it('should create restaurant with owner token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/restaurant')
      .set('jwt-token', ownerToken) // 💡 토큰 추가
      .send({
        name: 'Test Restaurant',
        address: '456 Elm St, City, Country',
        category: 'Italian',
      })
      .expect(201);
    // expect(res.body).toHaveProperty('token');
    // driverToken = res.body.token; // Store the token for further tests
  });
});
