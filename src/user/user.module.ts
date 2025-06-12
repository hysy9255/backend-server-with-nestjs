import { Module } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UserService } from './application/service/user.service';
import { DataSource } from 'typeorm';
import { CustomerCommandRepository } from './infrastructure/repositories/command/customer-command.repository';
import { OwnerCommandRepository } from './infrastructure/repositories/command/owner-command.repository';
import { UserResolver } from './interface/user.resolver';
import { JwtModule } from 'src/jwt/jwt.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserQueryRepository } from './infrastructure/repositories/query/user-query.repository';
import { UserCommandRepository } from './infrastructure/repositories/command/user-command.repository';
import { DriverCommandRepository } from './infrastructure/repositories/command/driver-command.repository';
// import { UserFactory } from './domain/user.factory';

@Module({
  imports: [],
  providers: [
    {
      provide: 'IUserQueryRepository',
      useFactory: (dataSource: DataSource) => {
        return new UserQueryRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'IUserCommandRepository',
      useFactory: (dataSource: DataSource) => {
        return new UserCommandRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'ICustomerCommandRepository',
      useFactory: (dataSource: DataSource) => {
        return new CustomerCommandRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'IDriverCommandRepository',
      useFactory: (dataSource: DataSource) => {
        return new DriverCommandRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'IOwnerCommandRepository',
      useFactory: (dataSource: DataSource) => {
        return new OwnerCommandRepository(dataSource.manager);
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
