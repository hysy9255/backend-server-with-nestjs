import { Module } from '@nestjs/common';
import { ClientOrderService } from './services/clientOrder.service';
import { DriverOrderService } from './services/driverOrder.service';
import { RestaurantOrderService } from './services/restaurantOrder.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { OrmRestaurantRepository } from 'src/restaurant/repositories/orm-restaurant.repository';
import { DataSource } from 'typeorm';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { OrmOrderRepository } from './repositories/orm-order.repository';

@Module({
  imports: [RestaurantModule],
  providers: [
    {
      provide: 'OrderRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmOrderRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    ClientOrderService,
    RestaurantOrderService,
    DriverOrderService,
  ],
})
export class OrderModule {}
