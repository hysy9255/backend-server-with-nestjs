import { Module } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UserService } from './user.service';

import { OrmUserRepository } from './repositories/orms/orm-user.repository';
import { DataSource } from 'typeorm';
import { OrmCustomerRepository } from './repositories/orms/orm-customer.repository';
import { OrmDriverRepository } from './repositories/orms/orm-driver.repository';
import { OrmOwnerRepository } from './repositories/orms/orm-owner.repository';
import { UserResolver } from './user.resolver';
import { JwtModule } from 'src/jwt/jwt.module';
import { AuthModule } from 'src/auth/auth.module';
// import { UserFactory } from './domain/user.factory';

@Module({
  imports: [],
  providers: [
    {
      provide: 'UserRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmUserRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'CustomerRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmCustomerRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'DriverRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmDriverRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'OwnerRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmOwnerRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    UserService,
    UserResolver,
    // UserFactory,
  ],
  // controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
