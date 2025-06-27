import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const password = 'password123';
  let order;
  let ownerToken;
  let clientToken;
  let driverToken;

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.query(`DELETE FROM "driver"`);
    await dataSource.query(`DELETE FROM "owner"`);
    await dataSource.query(`DELETE FROM "customer"`);
    await dataSource.query(`DELETE FROM "user"`); //
    await dataSource.destroy();
    await app.close();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // dto에 없는 값 제거
        forbidNonWhitelisted: true, // dto에 정의되지 않은 값이 있으면 에러
        transform: true, // payload 자동 변환
      }),
    );

    await app.init();

    // sign up a new owner & login
    await request(app.getHttpServer())
      .post('/api/user/owner')
      .send({
        email: 'owner@example.com',
        password,
        role: 'Owner',
      })
      .expect(201);

    const ownerSignUpResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'owner@example.com',
        password,
      })
      .expect(200);

    ownerToken = ownerSignUpResponse.body.token;

    // sign up a new customer & login
    await request(app.getHttpServer())
      .post('/api/user/customer')
      .send({
        email: 'client@example.com',
        password,
        deliveryAddress: '123 Main St, City, Country',
        role: 'Client',
      })
      .expect(201);

    const clientSignUpResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'client@example.com',
        password,
      })
      .expect(200);

    clientToken = clientSignUpResponse.body.token;

    // sign up a new driver & login
    await request(app.getHttpServer())
      .post('/api/user/driver')
      .send({
        email: 'driver@example.com',
        password,
        role: 'Delivery',
      })
      .expect(201);

    const driverSignUpResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'driver@example.com',
        password,
      })
      .expect(200);

    driverToken = driverSignUpResponse.body.token;

    // owner creates a restaurant
    await request(app.getHttpServer())
      .post('/api/restaurant')
      .set('jwt-token', ownerToken) // 💡 토큰 추가
      .send({
        name: 'Test Restaurant',
        address: '456 Elm St, City, Country',
        category: 'Italian',
      })
      .expect(201);

    // look up restaurants
    const restaurantsRes = await request(app.getHttpServer())
      .get('/api/restaurants')
      .expect(200);

    const restaurant = restaurantsRes.body[0];

    // customer places an order
    await request(app.getHttpServer())
      .post('/api/client/order')
      .set('jwt-token', clientToken) // 💡 토큰 추가
      .send({
        restaurantId: restaurant.id,
      })
      .expect(201);

    // look up orders
    const ordersRes = await request(app.getHttpServer())
      .get('/api/owner/orders')
      .set('jwt-token', ownerToken) // 💡 토큰 추가
      .expect(200);

    order = ordersRes.body[0];
  });

  describe('Order', () => {
    it('changes the order status to "Accepted"', async () => {
      await request(app.getHttpServer())
        .patch(`/api/owner/order/${order.id}/accept`)
        .set('jwt-token', ownerToken) // 💡 토큰 추가
        .expect(200);

      const orderResponse = await request(app.getHttpServer())
        .get(`/api/owner/order/${order.id}`)
        .set('jwt-token', ownerToken) // 💡 토큰 추가
        .expect(200);

      expect(orderResponse.body.status).toBe('Accepted');
    });

    it('changes the order status to "Ready"', async () => {
      await request(app.getHttpServer())
        .patch(`/api/owner/order/${order.id}/mark-ready`)
        .set('jwt-token', ownerToken) // 💡 토큰 추가
        .expect(200);

      const orderResponse = await request(app.getHttpServer())
        .get(`/api/owner/order/${order.id}`)
        .set('jwt-token', ownerToken) // 💡 토큰 추가
        .expect(200);

      expect(orderResponse.body.status).toBe('Ready');
      expect(orderResponse.body.driverId).toBeNull();
    });

    it('assigns driver to the order', async () => {
      await request(app.getHttpServer())
        .post(`/api/driver/order/${order.id}/accept`)
        .set('jwt-token', driverToken) // 💡 토큰 추가
        .expect(201);

      const orderResponse = await request(app.getHttpServer())
        .get(`/api/owner/order/${order.id}`)
        .set('jwt-token', ownerToken) // 💡 토큰 추가
        .expect(200);

      expect(orderResponse.body.driverId).toBeDefined();
    });

    it('changes the order status to "PickedUp"', async () => {
      await request(app.getHttpServer())
        .patch(`/api/driver/order/${order.id}/pickup`)
        .set('jwt-token', driverToken) // 💡 토큰 추가
        .expect(200);

      const orderResponse = await request(app.getHttpServer())
        .get(`/api/owner/order/${order.id}`)
        .set('jwt-token', ownerToken) // 💡 토큰 추가
        .expect(200);

      expect(orderResponse.body.driverId).toBeDefined();
      expect(orderResponse.body.status).toBe('PickedUp');
    });

    it('changes the order status to "Delivered"', async () => {
      await request(app.getHttpServer())
        .patch(`/api/driver/order/${order.id}/complete`)
        .set('jwt-token', driverToken) // 💡 토큰 추가
        .expect(200);

      const orderResponse = await request(app.getHttpServer())
        .get(`/api/owner/order/${order.id}`)
        .set('jwt-token', ownerToken) // 💡 토큰 추가
        .expect(200);

      expect(orderResponse.body.driverId).toBeDefined();
      expect(orderResponse.body.status).toBe('Delivered');
    });
  });
});
