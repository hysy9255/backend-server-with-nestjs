import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OrderEntity } from '../../domain/order.entity';
import { OrderMapper } from './mapper/order.mapper';
import { IOrderCommandRepository } from '../../infrastructure/repositories/command/order-command.repository.interface';
import { IOrderQueryRepository } from '../../infrastructure/repositories/query/order-query.repository.interface';
import { OwnerOrderSummaryProjection } from '../../infrastructure/repositories/query/projections/order.projection';

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
      throw new BadRequestException(
        'You must register a restaurant before viewing orders',
      );
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
      throw new BadRequestException(
        'You must register a restaurant before viewing orders',
      );
    }

    const order = await this.orderQryRepo.findOrderSummaryForOwner(orderId);

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    if (!owner.ownsRestaurantOf(order.restaurantId)) {
      throw new ForbiddenException(
        'This order does not belong to your restaurant',
      );
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
      throw new NotFoundException('Order Not Found');
    }

    return OrderMapper.toDomain(orderRecord);
  }

  // used
  private _validateOrderAccessRights(
    order: OrderEntity,
    owner: OwnerEntity,
  ): void {
    if (!owner.canAccessOrderOf(order)) {
      throw new ForbiddenException(
        'This order does not belong to your restaurant',
      );
    }
  }
}
