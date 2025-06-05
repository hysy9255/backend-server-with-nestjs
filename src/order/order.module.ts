import { Module } from '@nestjs/common';
import { ClientOrderService } from './services/clientOrder.service';
import { DriverOrderService } from './services/driverOrder.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { OrmRestaurantRepository } from 'src/restaurant/repositories/orm-restaurant.repository';
import { DataSource } from 'typeorm';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { OrmOrderRepository } from './repositories/orm-order.repository';
import {
  ClientOrderResolver,
  DriverOrderResolver,
  OwnerOrderResolver,
} from './order.resolver';
import { OwnerOrderService } from './services/ownerOrder.service';
import { OrmCustomerRepository } from 'src/user/repositories/orms/orm-customer.repository';
// import { OrderResolver } from './order.resolver';

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
    {
      provide: 'CustomerRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrmCustomerRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    ClientOrderService,
    OwnerOrderService,
    DriverOrderService,
    ClientOrderResolver,
    OwnerOrderResolver,
    DriverOrderResolver,
  ],
})
export class OrderModule {}
