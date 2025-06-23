import { Module } from '@nestjs/common';
import { ClientOrderService } from './application/service/clientOrder.service';
import { DriverOrderService } from './application/service/driverOrder.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import {
  ClientOrderResolver,
  DriverOrderResolver,
  OwnerOrderResolver,
} from './interface/order.resolver';
import { OwnerOrderService } from './application/service/ownerOrder.service';
import { OrderCommandRepository } from './infrastructure/repositories/command/order-command.repository';
import { OrderQueryRepository } from './infrastructure/repositories/query/order-query.repository';
import { OrderDriverRejectionCommandRepository } from './infrastructure/repositories/command/order-driver-rejection-command.repository';
import {
  ClientOrderController,
  DriverOrderController,
  OwnerOrderController,
} from './interface/order.controller';

@Module({
  imports: [RestaurantModule],
  providers: [
    {
      provide: 'IOrderCommandRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrderCommandRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'IOrderQueryRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrderQueryRepository(dataSource.manager);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: 'IOrderDriverRejectionCommandRepository',
      useFactory: (dataSource: DataSource) => {
        return new OrderDriverRejectionCommandRepository(dataSource.manager);
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
  controllers: [
    ClientOrderController,
    OwnerOrderController,
    DriverOrderController,
  ],
})
export class OrderModule {}
