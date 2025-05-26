import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DataSource } from 'typeorm';
import { OrmRestaurantRepository } from 'src/restaurant/repositories/orm-restaurant.repository';
import { getDataSourceToken } from '@nestjs/typeorm';
import { OrmDishRepository } from './repositories/orm-dish.repository';

@Module({
  providers: [
    {
      provide: 'RestaurantRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmRestaurantRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'DishRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmDishRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    DishService,
  ],
})
export class DishModule {}
