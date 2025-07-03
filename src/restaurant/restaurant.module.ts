import { Module } from '@nestjs/common';
import { RestaurantService } from './application/service/restaurant.external.service';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { RestaurantResolver } from './interface/restaurant.resolver';
import { RestaurantCommandRepository } from './infrastructure/repositories/command/restaurant-command.repository';
import { RestaurantQueryRepository } from './infrastructure/repositories/query/restaurant-query.repository';
import { UserModule } from 'src/user/user.module';
import { RestaurantController } from './interface/restaurant.controller';
import { RestaurantInternalService } from './application/service/restaurant.internal.service';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: 'IRestaurantCommandRepository',
      useFactory: (dataSource: DataSource) => {
        return new RestaurantCommandRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'IRestaurantQueryRepository',
      useFactory: (dataSource: DataSource) => {
        return new RestaurantQueryRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    RestaurantService,
    RestaurantInternalService,
    RestaurantResolver,
  ],
  controllers: [RestaurantController],
  exports: [RestaurantInternalService],
})
export class RestaurantModule {}
