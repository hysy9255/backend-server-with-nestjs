// user.service.int.spec.ts
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserService } from './application/service/user.external.service';
import { UserOrmEntity } from './infrastructure/orm-entities/user.orm.entity';
import { OwnerOrmEntity } from './infrastructure/orm-entities/owner.orm.entity';
import { UserModule } from './user.module';
import { CreateOwnerInput } from './interface/dtos/create-user.dto';
import { UserRole } from 'src/constants/userRole';
import { ConfigModule } from '@nestjs/config';
import { RestaurantOrmEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm.entity';
import { OrderOrmEntity } from 'src/order/infrastructure/orm-entities/order.orm.entity';
import { CustomerOrmEntity } from './infrastructure/orm-entities/client.orm.entity';
import { DriverOrmEntity } from './infrastructure/orm-entities/driver.orm.entity';
import { OrderDriverRejectionOrmEntity } from 'src/order/infrastructure/orm-entities/order-driver-rejection.orm';
import { UserQueryRepository } from './infrastructure/repositories/query/user/user-query.repository';
import { UserCommandRepository } from './infrastructure/repositories/command/user/user-command.repository';
import { DriverCommandRepository } from './infrastructure/repositories/command/driver-command.repository';
import { CustomerCommandRepository } from './infrastructure/repositories/command/client-command.repository';
import { OwnerCommandRepository } from './infrastructure/repositories/command/owner-command.repository';

describe('UserModule Integration', () => {
  let userService: UserService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
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
          entities: [
            UserOrmEntity,
            OwnerOrmEntity,
            CustomerOrmEntity,
            DriverOrmEntity,
            RestaurantOrmEntity,
            OrderOrmEntity,
            OrderDriverRejectionOrmEntity,
          ],
          synchronize: true,
        }),
        UserModule,
      ],
      providers: [
        UserService,
        {
          provide: 'IUserQueryRepository',
          useClass: UserQueryRepository,
        },
        {
          provide: 'IUserCommandRepository',
          useClass: UserCommandRepository,
        },
        {
          provide: 'IDriverCommandRepository',
          useClass: DriverCommandRepository,
        },
        {
          provide: 'ICustomerCommandRepository',
          useClass: CustomerCommandRepository,
        },
        {
          provide: 'IOwnerCommandRepository',
          useClass: OwnerCommandRepository,
        },
      ],
    }).compile();

    userService = module.get(UserService);
    dataSource = module.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const manager = dataSource.manager;
    await manager.query('DELETE FROM owner;');
    await manager.query('DELETE FROM "user";');
    await manager.query('DELETE FROM restaurant;');
  });

  it('should create an owner', async () => {
    const input: CreateOwnerInput = {
      email: 'test@example.com',
      password: '1234',
      role: UserRole.Owner,
    };

    await userService.createOwner(input);

    const userRepo = dataSource.getRepository(UserOrmEntity);
    const ownerRepo = dataSource.getRepository(OwnerOrmEntity);

    const user = await userRepo.findOneBy({ email: input.email });
    const owner = await ownerRepo.findOneBy({ userId: user?.id });

    expect(user).toBeDefined();
    expect(owner).toBeDefined();
  });
});
