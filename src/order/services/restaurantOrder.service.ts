import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository.interface';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OrderEntity } from '../domain/order.entity';
import { OrderMapper } from '../mapper/order.mapper';
import { OrderDTO } from '../dtos/order.dto';

@Injectable()
export class RestaurantOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async getOrdersByRestaurant(
    restaurantId: string,
    owner: OwnerEntity,
  ): Promise<OrderDTO[]> {
    if (!owner.ownsRestaurantOf(restaurantId)) {
      throw new ForbiddenException(
        'You can only view orders for restaurants you own',
      );
    }

    const orderRecords =
      await this.orderRepository.findByRestaurant(restaurantId);

    const orders = orderRecords.map((orderRecord) =>
      OrderMapper.toDomain(orderRecord),
    );

    return orders.map((order) => new OrderDTO(order));
  }

  async getOrder(orderId: string, owner: OwnerEntity): Promise<OrderDTO> {
    const order = await this.getOrderOrThrow(orderId);

    if (!owner.canAccessOrderOf(order)) {
      throw new ForbiddenException(
        'You do not own the restaurant for this order',
      );
    }

    return new OrderDTO(order);
  }

  async acceptOrder(orderId: string, owner: OwnerEntity): Promise<void> {
    const order = await this.getOrderOrThrow(orderId);
    this.validateOrderAccessRights(order, owner);
    order.markAccepted();
    await this.orderRepository.save(OrderMapper.toRecord(order));
  }

  async rejectOrder(orderId: string, owner: OwnerEntity): Promise<void> {
    const order = await this.getOrderOrThrow(orderId);
    this.validateOrderAccessRights(order, owner);
    order.markRejected();
    await this.orderRepository.save(OrderMapper.toRecord(order));
  }

  async markOrderAsReady(orderId: string, owner: OwnerEntity): Promise<void> {
    const order = await this.getOrderOrThrow(orderId);
    this.validateOrderAccessRights(order, owner);
    order.markReady();
    await this.orderRepository.save(OrderMapper.toRecord(order));
  }

  private validateOrderAccessRights(
    order: OrderEntity,
    owner: OwnerEntity,
  ): void {
    if (!owner.canAccessOrderOf(order)) {
      throw new ForbiddenException(
        'You do not own the restaurant for this order',
      );
    }
  }

  private async getOrderOrThrow(orderId: string): Promise<OrderEntity> {
    const orderRecord = await this.orderRepository.findOneById(orderId);
    if (!orderRecord) {
      throw new Error('Order not found');
    }
    return OrderMapper.toDomain(orderRecord);
  }
}
