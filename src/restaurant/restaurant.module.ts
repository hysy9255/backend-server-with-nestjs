import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { DataSource } from 'typeorm';
import { OrmRestaurantRepository } from './repositories/orm-restaurant.repository';
import { getDataSourceToken } from '@nestjs/typeorm';
// import { RestaurantResolver } from './restaurant.resolver';
// import { RestaurantController } from './restaurant.controller';

@Module({
  providers: [
    {
      provide: 'RestaurantRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmRestaurantRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    RestaurantService,
    // RestaurantResolver,
  ],
  // controllers: [RestaurantController],
  exports: [RestaurantService],
})
export class RestaurantModule {}
