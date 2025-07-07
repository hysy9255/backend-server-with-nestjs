import { Inject, Injectable } from '@nestjs/common';
import { IOrderCommandRepository } from '../../infrastructure/repositories/command/order-command.repository.interface';
import { IOrderQueryRepository } from '../../infrastructure/repositories/query/order-query.repository.interface';
import { OrderAccessPolicy } from './order.access.policy';
import { UserAuthService } from 'src/user/application/service/user.auth.service';
import { OrderEventPublisher } from '../order.event.publisher';
import { OrderInternalService } from './order.internal.service';
import { OrderForOwner } from 'src/order/infrastructure/repositories/query/projections/order.projection';
import { OrderMapper } from '../order.mapper';
import { UserInfoProjection } from 'src/user/infrastructure/repositories/query/user.info.projection';

@Injectable()
export class OwnerOrderService {
  constructor(
    @Inject('IOrderCommandRepository')
    private readonly orderCmdRepo: IOrderCommandRepository,
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,

    private readonly orderAccessPolicy: OrderAccessPolicy,
    private readonly userAuthService: UserAuthService,
    private readonly orderEventPublisher: OrderEventPublisher,
    private readonly orderInternalService: OrderInternalService,
  ) {}

  async getOrders(userInfo: UserInfoProjection): Promise<OrderForOwner[]> {
    const owner = await this.userAuthService._getOwner(userInfo.userId);
    owner.ensureHasRestaurant();
    return await this.orderQryRepo.findManyForOwner(owner.restaurantId!);
  }

  async getOrder(
    userInfo: UserInfoProjection,
    orderId: string,
  ): Promise<OrderForOwner> {
    const owner = await this.userAuthService._getOwner(userInfo.userId);
    owner.ensureHasRestaurant();
    await this.orderAccessPolicy.assertOwnerCanAccessOrder(owner.id, orderId);
    return await this.orderQryRepo.findOneForOwner(orderId);
  }

  async accept(orderId: string, userInfo: UserInfoProjection): Promise<void> {
    const owner = await this.userAuthService._getOwner(userInfo.userId);
    const order = await this.orderInternalService._getOrder(orderId);
    owner.ensureCanAccessOrderOf(order);
    order.markAccepted();
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
    await this.orderEventPublisher.broadcastOrderStatusUpdate(order.id);
  }

  async reject(orderId: string, userInfo: UserInfoProjection): Promise<void> {
    const owner = await this.userAuthService._getOwner(userInfo.userId);
    const order = await this.orderInternalService._getOrder(orderId);
    owner.ensureCanAccessOrderOf(order);
    order.markRejected();
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
    await this.orderEventPublisher.broadcastOrderStatusUpdate(order.id);
  }

  async markReady(
    orderId: string,
    userInfo: UserInfoProjection,
  ): Promise<void> {
    const owner = await this.userAuthService._getOwner(userInfo.userId);
    const order = await this.orderInternalService._getOrder(orderId);
    owner.ensureCanAccessOrderOf(order);
    order.markReady();
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
    await this.orderEventPublisher.broadcastOrderStatusUpdate(order.id);
  }
}
