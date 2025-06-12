import { Module } from '@nestjs/common';
import { RestaurantService } from './application/service/restaurant.service';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { RestaurantResolver } from './interface/restaurant.resolver';
import { RestaurantCommandRepository } from './infrastructure/repositories/command/restaurant-command.repository';
import { RestaurantQueryRepository } from './infrastructure/repositories/query/restaurant-query.repository';
import { UserModule } from 'src/user/user.module';

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
    RestaurantResolver,
  ],
  // controllers: [RestaurantController],
  exports: [RestaurantService],
})
export class RestaurantModule {}
