import { Module } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { OrmUserRepository } from './repositories/orm-user.repository';
import { DataSource } from 'typeorm';
import { UserFactory } from './domain/user.factory';

@Module({
  providers: [
    {
      provide: 'UserRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmUserRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    UserService,
    UserResolver,
    UserFactory,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
