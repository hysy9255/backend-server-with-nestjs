import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { MemoryRestaurantRepository } from './repositories/memory-restaurant.repository';
import { RESTAURANT_ERROR_MESSAGES } from 'src/constants/errorMessages';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { UserRole } from 'src/constants/userRole';
import { MemoryUserRepository } from 'src/user/repositories/memory-user.repository';
import { UserFactory } from 'src/user/domain/user.factory';
import { RestaurantModule } from './restaurant.module';
import { ConfigModule } from '@nestjs/config';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './domain/restaurant.entity';
import { User } from 'src/user/domain/user.entity';
import { OrmRestaurantRepository } from './repositories/orm-restaurant.repository';
import { OrmUserRepository } from 'src/user/repositories/orm-user.repository';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Order } from 'src/order/domain/order.entity';
import { Dish } from 'src/dish/domain/dish.entity';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('RestaurantService', () => {
  let module: TestingModule;
  let restaurantService: RestaurantService;
  let userService: UserService;
  let restaurantRepository: OrmRestaurantRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        UserModule,
        RestaurantModule,
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
      ],
      providers: [],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    userService = module.get<UserService>(UserService);
    restaurantRepository = module.get<OrmRestaurantRepository>(
      'RestaurantRepository',
    );
  });

  beforeEach(async () => {
    await userService.createUser({
      email: 'test@example.com',
      password: '1234',
      role: UserRole.Client,
    });
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

  const name = 'Test Restaurant';
  const address = '123 Test St';
  const category = 'Test Cuisine';

  describe('createRestaurant', () => {
    it('should return restaurant when createRestaurant is called', async () => {
      // when
      const user = await userService.findUserByEmail('test@example.com');

      const restaurant = await restaurantService.createRestaurant(user, {
        name,
        address,
        category,
      });
      // then
      expect(restaurant.name).toBe('Test Restaurant');
      expect(restaurant.address).toBe('123 Test St');
      expect(restaurant.category).toBe('Test Cuisine');
    });
  });

  describe('getRestaurant', () => {
    it('should return restaurant when getRestaurant is called', async () => {
      // given
      const user = await userService.findUserByEmail('test@example.com');
      const restaurant = await restaurantService.createRestaurant(user, {
        name,
        address,
        category,
      });

      // when
      const foundRestaurant = await restaurantService.getRestaurant({
        id: restaurant.id,
      });

      // then
      expect(foundRestaurant.name).toBe(restaurant.name);
      expect(foundRestaurant.address).toBe(restaurant.address);
      expect(foundRestaurant.category).toBe(restaurant.category);
    });

    it('should throw an error when restaurant is not found', async () => {
      // when + then
      await expect(
        restaurantService.getRestaurant({ id: uuidv4() }),
      ).rejects.toThrow(RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND);
    });
  });
});
