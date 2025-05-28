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
import { OrderRepository } from './repositories/order-repository.interface';
import { OrmOrderRepository } from './repositories/orm-order.repository';
import { UserRepository } from 'src/user/repositories/user-repository.interface';
import { RestaurantRepository } from 'src/restaurant/repositories/restaurant-repository.interface';
import { OrmUserRepository } from 'src/user/repositories/orm-user.repository';
import { OrmRestaurantRepository } from 'src/restaurant/repositories/orm-restaurant.repository';

describe('OrderIntegration', () => {
  let module: TestingModule;
  let clientOrderService: ClientOrderService;
  let driverOrderService: DriverOrderService;
  let restaurantOrderService: RestaurantOrderService;
  let userService: UserService;
  let restaurantService: RestaurantService;
  let orderRepository: OrderRepository;
  let userRepository: UserRepository;
  let restaurantRepository: RestaurantRepository;

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
      providers: [
        {
          provide: 'OrderRepository',
          useClass: OrmOrderRepository,
        },
        {
          provide: 'UserRepository',
          useClass: OrmUserRepository,
        },
        {
          provide: 'RestaurantRepository',
          useClass: OrmRestaurantRepository,
        },
      ],
    }).compile();

    clientOrderService = module.get<ClientOrderService>(ClientOrderService);
    driverOrderService = module.get<DriverOrderService>(DriverOrderService);
    restaurantOrderService = module.get<RestaurantOrderService>(
      RestaurantOrderService,
    );
    userService = module.get<UserService>(UserService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
    orderRepository = module.get<OrderRepository>('OrderRepository');
    userRepository = module.get<UserRepository>('UserRepository');
    restaurantRepository = module.get<RestaurantRepository>(
      'RestaurantRepository',
    );
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
  let anotherOwner: User;
  let driver: User;
  let restaurant: Restaurant;
  let anotherRestaurant: Restaurant;
  let anotherRestaurantOrder: Order;

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

    owner = await userService.findUserWithAssociatedRestaurantById(owner.id);

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

    const { id: anotherOwnerId } = await userService.createUser({
      email: 'anotherOwner@test.com',
      password: 'password',
      role: UserRole.Owner,
    });
    anotherOwner = await userService.findUserById(anotherOwnerId);

    const { id: anotherRestaurantId } =
      await restaurantService.createRestaurant(anotherOwner, {
        name: 'anotherRestaurant',
        address: 'address',
        category: 'category',
      });

    anotherRestaurant = await restaurantService.getRestaurant({
      id: anotherRestaurantId,
    });

    anotherOwner =
      await userService.findUserWithAssociatedRestaurantById(anotherOwnerId);

    const { id: anotherRestaurantOrderId } =
      await clientOrderService.createOrder(customer, {
        restaurantId: anotherRestaurant.id,
      });

    anotherRestaurantOrder = await restaurantOrderService.getOrder(
      anotherRestaurantOrderId,
      anotherOwner,
    );
  });

  describe('ClientOrderService', () => {
    describe('createOrder', () => {
      it('should create an order', async () => {
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

  describe('RestaurantOrderService', () => {
    describe('getOrdersByRestaurant', () => {
      it('should get orders by restaurant', async () => {
        // given
        await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });
        // when
        const result = await restaurantOrderService.getOrdersByRestaurant(
          restaurant.id,
          owner,
        );
        // then
        expect(result.length).toBe(1);
      });
      it('should throw an error if the user is not the owner of the restaurant', async () => {
        // when + then
        await expect(
          restaurantOrderService.getOrdersByRestaurant(
            anotherRestaurant.id,
            owner,
          ),
        ).rejects.toThrow('You can only view orders for restaurants you own');
      });
    });
    describe('getOrder', () => {
      it('should get order', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });
        // when
        const result = await restaurantOrderService.getOrder(orderId, owner);
        // then
        expect(result).toBeDefined();
        expect(result.id).toBe(orderId);
      });
      it('should throw an error if the user is not the owner of the restaurant', async () => {
        // when + then
        await expect(
          restaurantOrderService.getOrder(anotherRestaurantOrder.id, owner),
        ).rejects.toThrow('You do not own the restaurant for this order');
      });
    });
    describe('acceptOrder', () => {
      it('should accept order', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });
        // when
        await restaurantOrderService.acceptOrder(orderId, owner);
        // then
        const result = await orderRepository.findOneById(orderId);
        expect(result).toBeDefined();
        expect(result?.status).toBe(OrderStatus.Accepted);
      });
      it('should throw an error if the user is not the owner of the restaurant', async () => {
        // when + then
        await expect(
          restaurantOrderService.acceptOrder(anotherRestaurantOrder.id, owner),
        ).rejects.toThrow('You do not own the restaurant for this order');
      });
    });

    describe('rejectOrder', () => {
      it('should reject order', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });

        // when
        await restaurantOrderService.rejectOrder(orderId, owner);

        // then
        const result = await orderRepository.findOneById(orderId);
        expect(result).toBeDefined();
        expect(result?.status).toBe(OrderStatus.Rejected);
      });

      it('should throw an error if the user is not the owner of the restaurant', async () => {
        // when + then
        await expect(
          restaurantOrderService.rejectOrder(anotherRestaurantOrder.id, owner),
        ).rejects.toThrow('You do not own the restaurant for this order');
      });
    });

    describe('markOrderAsReady', () => {
      it('should mark order as ready', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });
        await restaurantOrderService.acceptOrder(orderId, owner);
        // when
        await restaurantOrderService.markOrderAsReady(orderId, owner);
        // then
        const result = await orderRepository.findOneById(orderId);
        expect(result).toBeDefined();
        expect(result?.status).toBe(OrderStatus.Ready);
      });

      it('should throw an error if the user is not the owner of the restaurant', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: anotherRestaurant.id,
        });

        await restaurantOrderService.acceptOrder(orderId, anotherOwner);

        // when + then
        await expect(
          restaurantOrderService.markOrderAsReady(orderId, owner),
        ).rejects.toThrow('You do not own the restaurant for this order');
      });
    });
  });

  describe('DriverOrderService', () => {
    describe('availableOrders', () => {
      it('should show all the available orders for the driver', async () => {
        // given
        const { id: orderId_1 } = await clientOrderService.createOrder(
          customer,
          {
            restaurantId: restaurant.id,
          },
        );
        await restaurantOrderService.acceptOrder(orderId_1, owner);
        await restaurantOrderService.markOrderAsReady(orderId_1, owner);
        await driverOrderService.rejectOrder(orderId_1, driver);

        const { id: orderId_2 } = await clientOrderService.createOrder(
          customer,
          {
            restaurantId: restaurant.id,
          },
        );
        await restaurantOrderService.acceptOrder(orderId_2, owner);
        await restaurantOrderService.markOrderAsReady(orderId_2, owner);

        // when
        const result = await driverOrderService.availableOrders(driver);
        // then
        expect(result.length).toBe(1);
      });
    });

    describe('acceptOrder', () => {
      it('should accept order', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });
        await restaurantOrderService.acceptOrder(orderId, owner);
        await restaurantOrderService.markOrderAsReady(orderId, owner);
        // when
        await driverOrderService.acceptOrder(orderId, driver);
        // then
        const result = await orderRepository.findOneById(orderId);
        expect(result).toBeDefined();
        expect(result?.driver).toBeDefined();
        expect(result?.driver.id).toBe(driver.id);
      });
    });

    describe('rejectOrder', () => {
      it('should reject order', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });
        await restaurantOrderService.acceptOrder(orderId, owner);
        await restaurantOrderService.markOrderAsReady(orderId, owner);
        // when
        await driverOrderService.rejectOrder(orderId, driver);
        // then
        const result =
          await orderRepository.findOneWithFullRelationById(orderId);
        expect(result).toBeDefined();
        expect(result?.rejectedByDrivers.some((d) => d.id === driver.id)).toBe(
          true,
        );
      });
    });

    describe('pickupOrder', () => {
      it('should pick up order', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });
        await restaurantOrderService.acceptOrder(orderId, owner);
        await restaurantOrderService.markOrderAsReady(orderId, owner);
        await driverOrderService.acceptOrder(orderId, driver);

        // when
        await driverOrderService.pickupOrder(orderId, driver);

        // then
        const result = await orderRepository.findOneById(orderId);
        expect(result).toBeDefined();
        expect(result?.status).toBe(OrderStatus.PickedUp);
      });
    });

    describe('completeOrder', () => {
      it('should complete order', async () => {
        // given
        const { id: orderId } = await clientOrderService.createOrder(customer, {
          restaurantId: restaurant.id,
        });
        await restaurantOrderService.acceptOrder(orderId, owner);
        await restaurantOrderService.markOrderAsReady(orderId, owner);
        await driverOrderService.acceptOrder(orderId, driver);
        await driverOrderService.pickupOrder(orderId, driver);
        // when
        await driverOrderService.completeOrder(orderId, driver);
        // then
        const result = await orderRepository.findOneById(orderId);
        expect(result).toBeDefined();
        expect(result?.status).toBe(OrderStatus.Delivered);
      });
    });
  });
});
