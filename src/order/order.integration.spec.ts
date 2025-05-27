import { Test, TestingModule } from '@nestjs/testing';
import { ClientOrderService } from './services/clientOrder.service';
import { UserService } from 'src/user/user.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order.module';
import { UserModule } from 'src/user/user.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { DataSource } from 'typeorm';
import { DriverOrderService } from './services/driverOrder.service';
import { RestaurantOrderService } from './services/restaurantOrder.service';
import { Restaurant } from 'src/restaurant/domain/restaurant.entity';
import { User } from 'src/user/domain/user.entity';
import { Order } from './domain/order.entity';
import { ConfigModule } from '@nestjs/config';
import { UserRole } from 'src/constants/userRole';
import { OrderStatus } from 'src/constants/orderStatus';
import { v4 as uuidv4 } from 'uuid';

describe('OrderIntegration', () => {
  let module: TestingModule;
  let clientOrderService: ClientOrderService;
  let driverOrderService: DriverOrderService;
  let restaurantOrderService: RestaurantOrderService;
  let userService: UserService;
  let restaurantService: RestaurantService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath:
            process.env.NODE_ENV === 'test.local'
              ? '.env.test.local'
              : '.env.development.local',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: 5432,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [Restaurant, User, Order],
          synchronize: true,
        }),
        OrderModule,
        UserModule,
        RestaurantModule,
      ],
    }).compile();

    clientOrderService = module.get<ClientOrderService>(ClientOrderService);
    driverOrderService = module.get<DriverOrderService>(DriverOrderService);
    restaurantOrderService = module.get<RestaurantOrderService>(
      RestaurantOrderService,
    );
    userService = module.get<UserService>(UserService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
  });

  afterEach(async () => {
    const manager = module.get<DataSource>(getDataSourceToken()).manager;
    await manager.query('DELETE FROM "restaurant";');
    await manager.query('DELETE FROM "user";');
  });

  afterAll(async () => {
    const dataSource = module.get<DataSource>(getDataSourceToken());
    await dataSource.destroy();
    await module.close();
  });

  let customer: User;
  let owner: User;
  let driver: User;
  let restaurant: Restaurant;

  beforeEach(async () => {
    const { id: ownerId } = await userService.createUser({
      email: 'owner@test.com',
      password: '1234',
      role: UserRole.Owner,
    });

    owner = await userService.findUserById(ownerId);

    const { id: restaurantId } = await restaurantService.createRestaurant(
      owner,
      {
        name: 'restaurant1',
        address: 'address1',
        category: 'cafe',
      },
    );

    restaurant = await restaurantService.getRestaurant({
      id: restaurantId,
    });

    const { id: customerId } = await userService.createUser({
      email: 'customer@test.com',
      password: '1234',
      role: UserRole.Client,
    });

    customer = await userService.findUserById(customerId);

    const { id: driverId } = await userService.createUser({
      email: 'driver@test.com',
      password: '1234',
      role: UserRole.Delivery,
    });

    driver = await userService.findUserById(driverId);
  });

  describe('ClientOrderService', () => {
    describe('createOrder', () => {
      it('should create an order', async () => {
        // given

        // when
        const result = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });

        // expect
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
      });
    });

    describe('getOrder', () => {
      it('should get an order by ID', async () => {
        // given

        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });

        // when
        const order = await clientOrderService.getOrder(customer, orderId);
        // then
        expect(order).toBeDefined();
        expect(order.id).toBe(orderId);
        expect(order.customer.id).toBe(customer.id);
        expect(order.restaurant.id).toBe(restaurant.id);
        expect(order.status).toBe(OrderStatus.Pending);
      });

      it('should throw an error if order not found', async () => {
        // given
        const nonExistentOrderId = uuidv4();
        // when + then
        await expect(
          clientOrderService.getOrder(customer, nonExistentOrderId),
        ).rejects.toThrow('Order not found');
      });

      it('should throw an error if order requested by another user', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });

        const { id: wrongCustomerId } = await userService.createUser({
          email: 'customer2@test.com',
          password: '1234',
          role: UserRole.Client,
        });

        const wrongCustomer = await userService.findUserById(wrongCustomerId);

        // when + then
        await expect(
          clientOrderService.getOrder(wrongCustomer, orderId),
        ).rejects.toThrow('You do not own this order');
      });
    });

    describe('getOrderHistory', () => {
      it('should return order history for a user', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });

        owner = await userService.findUserWithAssociatedRestaurantById(
          owner.id,
        );

        await restaurantOrderService.acceptOrder(orderId, owner);
        await restaurantOrderService.markOrderAsReady(orderId, owner);
        await driverOrderService.acceptOrder(orderId, driver);
        await driverOrderService.pickupOrder(orderId, driver);
        await driverOrderService.completeOrder(orderId, driver);

        // when
        const orders = await clientOrderService.getOrderHistory(customer);

        // then
        expect(orders).toBeDefined();
        expect(orders.length).toBe(1);
      });
    });
  });
});
