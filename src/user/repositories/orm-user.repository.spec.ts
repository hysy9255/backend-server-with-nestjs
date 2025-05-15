import { Test, TestingModule } from '@nestjs/testing';
import { OrmUserRepository } from './orm-user.repository';
import { DataSource } from 'typeorm';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserFactory } from '../domain/user.factory';
import { UserRole } from 'src/constants/userRole';
import { Restaurant } from 'src/restaurant/domain/restaurant.entity';

describe('OrmUserRepository', () => {
  let module: TestingModule;
  let userRepository: OrmUserRepository;
  let userFactory: UserFactory;
  beforeEach(async () => {
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
          entities: [User, Restaurant],
          synchronize: true,
        }),
      ],
      providers: [
        {
          provide: 'UserRepository',
          useFactory: (dataSource: DataSource) => {
            return new OrmUserRepository(dataSource.manager);
          },
          inject: [getDataSourceToken()],
        },
        UserFactory,
      ],
    }).compile();
    userRepository = module.get<OrmUserRepository>('UserRepository');
    userFactory = module.get<UserFactory>(UserFactory);
  });

  afterEach(async () => {
    const manager = module.get<DataSource>(getDataSourceToken()).manager;
    await manager.query('DELETE FROM "user";');
  });

  afterAll(async () => {
    const dataSource = module.get<DataSource>(getDataSourceToken());
    await dataSource.destroy();
    await module.close();
  });

  const email = 'test@example.com';
  const password = 'password';
  const role = UserRole.Client;
  describe('save', () => {
    it('should return User object when user data is saved', async () => {
      // given
      const user = await userFactory.createNewUser(email, password, role);
      // when
      const savedUser = await userRepository.save(user);
      // then
      expect(savedUser).toBeInstanceOf(User);
      expect(savedUser).toHaveProperty('id');
    });
  });

  describe('findByEmail', () => {
    it('should return User object when user is found by email', async () => {
      // given
      const user = await userFactory.createNewUser(email, password, role);
      await userRepository.save(user);
      // when
      const foundUser = await userRepository.findByEmail(email);
      // then
      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser).toHaveProperty('id');
      expect(foundUser?.email).toBe(email);
    });
  });

  describe('findById', () => {
    it('should return User object when user is found by id', async () => {
      // given
      const user = await userFactory.createNewUser(email, password, role);
      const savedUser = await userRepository.save(user);
      // when
      const foundUser = await userRepository.findById(savedUser.id);
      // then
      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser).toHaveProperty('id');
      expect(foundUser?.id).toBe(savedUser.id);
    });
  });
});
