import { Module } from '@nestjs/common';
import { ClientOrderService } from './application/service/order.external.client.service';
import { DriverOrderService } from './application/service/order.external.driver.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import {
  ClientOrderResolver,
  DriverOrderResolver,
  OwnerOrderResolver,
} from './interface/order.resolver';
import { OwnerOrderService } from './application/service/order.external.owner.service';
import { OrderCommandRepository } from './infrastructure/repositories/command/order-command.repository';
import { OrderQueryRepository } from './infrastructure/repositories/query/order-query.repository';
import { OrderDriverRejectionCommandRepository } from './infrastructure/repositories/command/order-driver-rejection-command.repository';
import {
  ClientOrderController,
  DriverOrderController,
  OwnerOrderController,
} from './interface/order.controller';
import { OrderAccessPolicy } from './application/service/order.access.policy';
import { RestaurantQueryRepository } from 'src/restaurant/infrastructure/repositories/query/restaurant-query.repository';
import { UserModule } from 'src/user/user.module';
import { PubSub } from 'graphql-subscriptions';
import { OrderEventPublisher } from './application/order.event.publisher';
import { OrderInternalService } from './application/service/order.internal.service';
import { OrderSubscriptionResolver } from './interface/order.subscription.resolver';
import { DriverCommandRepository } from 'src/user/infrastructure/repositories/command/driver/driver-command.repository';

@Module({
  imports: [RestaurantModule, UserModule],
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
    {
      provide: 'IRestaurantQueryRepository',
      useFactory: (dataSource: DataSource) => {
        return new RestaurantQueryRepository(dataSource.manager);
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
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
    OrderSubscriptionResolver,
    OrderEventPublisher,
    OrderAccessPolicy,
    ClientOrderService,
    OwnerOrderService,
    DriverOrderService,
    ClientOrderResolver,
    OwnerOrderResolver,
    DriverOrderResolver,
    OrderInternalService,
  ],
  controllers: [
    ClientOrderController,
    OwnerOrderController,
    DriverOrderController,
  ],
})
export class OrderModule {}
