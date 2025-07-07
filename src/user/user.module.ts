import { Module } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UserService } from './application/service/user.external.service';
import { DataSource } from 'typeorm';
import { UserResolver } from './interface/user.resolver';
import { UserQueryRepository } from './infrastructure/repositories/query/user/user-query.repository';
import { UserCommandRepository } from './infrastructure/repositories/command/user/user-command.repository';
import { UserAuthService } from './application/service/user.auth.service';
import { UserController } from './interface/user.controller';
import { UserInternalService } from './application/service/user.internal.service';
import { ClientCommandRepository } from './infrastructure/repositories/command/client/client-command.repository';
import { DriverCommandRepository } from './infrastructure/repositories/command/driver/driver-command.repository';
import { OwnerCommandRepository } from './infrastructure/repositories/command/owner/owner-command.repository';
import { ClientQueryRepository } from './infrastructure/repositories/query/client/client-query.repository';
import { OwnerQueryRepository } from './infrastructure/repositories/query/owner/owner-query.repository';
import { DriverQueryRepository } from './infrastructure/repositories/query/driver/driver-query.repository';

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
      provide: 'IClientCommandRepository',
      useFactory: (dataSource: DataSource) => {
        return new ClientCommandRepository(dataSource.manager);
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
    {
      provide: 'IOwnerQueryRepository',
      useFactory: (dataSource: DataSource) => {
        return new OwnerQueryRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'IClientQueryRepository',
      useFactory: (dataSource: DataSource) => {
        return new ClientQueryRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'IDriverQueryRepository',
      useFactory: (dataSource: DataSource) => {
        return new DriverQueryRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    UserService,
    UserInternalService,
    UserAuthService,
    UserResolver,
    // UserFactory,
  ],
  controllers: [UserController],
  exports: [UserService, UserAuthService, UserInternalService],
})
export class UserModule {}
