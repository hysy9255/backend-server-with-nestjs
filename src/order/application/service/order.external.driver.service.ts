import { Inject, Injectable } from '@nestjs/common';
import { OrderDriverRejectionOrmEntity } from '../../infrastructure/orm-entities/order-driver-rejection.orm';
import { IOrderCommandRepository } from '../../infrastructure/repositories/command/order-command.repository.interface';
import { IOrderQueryRepository } from '../../infrastructure/repositories/query/order-query.repository.interface';
import { OrderDriverRejectionCommandRepository } from '../../infrastructure/repositories/command/order-driver-rejection-command.repository';
import { UserAuthService } from 'src/user/application/service/user.auth.service';
import { OrderEventPublisher } from '../order.event.publisher';
import { OrderInternalService } from './order.internal.service';
import { OrderForDriver } from 'src/order/infrastructure/repositories/query/projections/order.projection';
import { OrderMapper } from '../order.mapper';
import { UserInfoProjection } from 'src/user/infrastructure/repositories/query/user.info.projection';
import { IDriverCommandRepository } from 'src/user/infrastructure/repositories/command/driver/driver-command.repository.interface';
import { DriverMapper } from 'src/user/application/mapper/driver.mapper';

@Injectable()
export class DriverOrderService {
  constructor(
    @Inject('IOrderDriverRejectionCommandRepository')
    private readonly orderDriverRejectCmdRepo: OrderDriverRejectionCommandRepository,
    @Inject('IOrderCommandRepository')
    private readonly orderCmdRepo: IOrderCommandRepository,
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,
    private readonly userAuthService: UserAuthService,
    private readonly orderEventPublisher: OrderEventPublisher,
    private readonly orderInternalService: OrderInternalService,
    @Inject('IDriverCommandRepository')
    private readonly driverCmdRepo: IDriverCommandRepository,
  ) {}

  async getOrders(userInfo: UserInfoProjection): Promise<OrderForDriver[]> {
    const driver = await this.userAuthService._getDriver(userInfo.userId);
    return await this.orderQryRepo.findAvailableForDriver(driver.id);
  }

  async getOrder(
    userInfo: UserInfoProjection,
    orderId: string,
  ): Promise<OrderForDriver> {
    const driver = await this.userAuthService._getDriver(userInfo.userId);
    const order = await this.orderQryRepo.findOneForDriver(orderId);
    driver.ensureCanAccessOrderOf(order);
    return order;
  }

  async getOrderHistory(
    userInfo: UserInfoProjection,
  ): Promise<OrderForDriver[]> {
    const driver = await this.userAuthService._getDriver(userInfo.userId);
    return await this.orderQryRepo.findDeliveredForDriver(driver.id);
  }

  async accept(orderId: string, userInfo: UserInfoProjection): Promise<void> {
    const driver = await this.userAuthService._getDriver(userInfo.userId);
    const order = await this.orderInternalService._getOrder(orderId);
    order.assignDriver(driver);
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
    await this.driverCmdRepo.save(DriverMapper.toOrmEntity(driver));
    await this.orderEventPublisher.broadcastOrderStatusUpdate(order.id);
  }

  async reject(orderId: string, userInfo: UserInfoProjection): Promise<void> {
    const driver = await this.userAuthService._getDriver(userInfo.userId);
    const order = await this.orderInternalService._getOrder(orderId);
    order.markRejectedByDriver(driver);
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
    await this.orderDriverRejectCmdRepo.save(
      new OrderDriverRejectionOrmEntity(orderId, driver.id),
    );
  }

  async pickup(orderId: string, userInfo: UserInfoProjection): Promise<void> {
    const driver = await this.userAuthService._getDriver(userInfo.userId);
    const order = await this.orderInternalService._getOrder(orderId);
    order.markPickedUp(driver);
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
    await this.orderEventPublisher.broadcastOrderStatusUpdate(order.id);
  }

  async completeDelivery(
    orderId: string,
    userInfo: UserInfoProjection,
  ): Promise<void> {
    const driver = await this.userAuthService._getDriver(userInfo.userId);
    const order = await this.orderInternalService._getOrder(orderId);
    order.markDelivered(driver);
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
    await this.driverCmdRepo.save(DriverMapper.toOrmEntity(driver));
    await this.orderEventPublisher.broadcastOrderStatusUpdate(order.id);
  }
}
