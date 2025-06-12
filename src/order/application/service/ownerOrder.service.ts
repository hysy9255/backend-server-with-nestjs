import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OrderEntity } from '../../domain/order.entity';
import { OrderMapper } from './mapper/order.mapper';
import { IOrderCommandRepository } from '../command/repositories/order-command.repository.interface';
import { IOrderQueryRepository } from '../query/repositories/order-query.repository.interface';
import { OwnerOrderSummaryProjection } from '../query/projections/order.projection';

@Injectable()
export class OwnerOrderService {
  constructor(
    @Inject('IOrderCommandRepository')
    private readonly orderCmdRepo: IOrderCommandRepository,
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,
  ) {}

  // used
  async getOrders(owner: OwnerEntity): Promise<OwnerOrderSummaryProjection[]> {
    if (!owner.hasRestaurant()) {
      throw new Error("You don't have a registered restaurant yet!");
    }
    return await this.orderQryRepo.findOrderSummariesForOwner(
      owner.restaurantId!,
    );
  }

  // used
  async getOrder(
    owner: OwnerEntity,
    orderId: string,
  ): Promise<OwnerOrderSummaryProjection> {
    if (!owner.hasRestaurant()) {
      throw new Error("You don't have a registered restaurant yet!");
    }

    const order = await this.orderQryRepo.findOrderSummaryForOwner(orderId);

    if (!order) {
      throw new Error('Order is not found');
    }

    if (!owner.ownsRestaurantOf(order.restaurantId)) {
      throw new Error('You do not own the restaurant for this order');
    }

    return order;
  }

  // used
  async acceptOrder(orderId: string, owner: OwnerEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    this._validateOrderAccessRights(order, owner);
    order.markAccepted();
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
  }

  // used
  async rejectOrder(orderId: string, owner: OwnerEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    this._validateOrderAccessRights(order, owner);
    order.markRejected();
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
    // notify the client (through subscription)
  }

  // used
  async markOrderAsReady(orderId: string, owner: OwnerEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    this._validateOrderAccessRights(order, owner);
    order.markReady();
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
  }

  // used
  private async _getOrderOrThrow(orderId: string): Promise<OrderEntity> {
    const orderRecord = await this.orderCmdRepo.findOneById(orderId);
    if (!orderRecord) {
      throw new Error('Order not found');
    }
    // should fix // attention
    // return OrderMapper.toDomainTemporary(orderRecord);
    return OrderMapper.toDomain(orderRecord);
  }

  // used
  private _validateOrderAccessRights(
    order: OrderEntity,
    owner: OwnerEntity,
  ): void {
    if (!owner.canAccessOrderOf(order)) {
      throw new ForbiddenException(
        'You do not own the restaurant for this order',
      );
    }
  }
}
