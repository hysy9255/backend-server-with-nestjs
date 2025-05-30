import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository.interface';
import { UserRecord } from 'src/user/orm-records/user.record';
import { OrderRecord } from '../orm-records/order.record';
import { UserEntity } from 'src/user/domain/user.entity';

@Injectable()
export class RestaurantOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async getOrdersByRestaurant(restaurantId: string, owner: UserEntity) {
    // if (restaurantId !== owner.restaurant?.id) {
    //   throw new Error('You can only view orders for restaurants you own');
    // }
    return await this.orderRepository.findByRestaurant(restaurantId);
  }

  async getOrder(orderId: string, owner: UserRecord) {
    const order = await this.getOrderOrThrow(orderId);
    this.ensureOrderOwnedByUser(order, owner);
    return order;
  }

  async acceptOrder(orderId: string, owner: UserRecord) {
    const order = await this.getOrderOrThrow(orderId);
    this.ensureOrderOwnedByUser(order, owner);
    order.markAccepted();
    return await this.orderRepository.save(order);
  }

  async rejectOrder(orderId: string, owner: UserRecord) {
    const order = await this.getOrderOrThrow(orderId);
    this.ensureOrderOwnedByUser(order, owner);
    order.markRejected();
    return await this.orderRepository.save(order);
  }

  async markOrderAsReady(orderId: string, owner: UserRecord) {
    const order = await this.getOrderOrThrow(orderId);
    this.ensureOrderOwnedByUser(order, owner);
    order.markReady();
    return await this.orderRepository.save(order);
  }

  private async getOrderOrThrow(orderId: string) {
    const order = await this.orderRepository.findOneById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  private ensureOrderOwnedByUser(order: OrderRecord, owner: UserRecord): void {
    if (!owner.restaurant || order.restaurant.id !== owner.restaurant.id) {
      throw new ForbiddenException(
        'You do not own the restaurant for this order',
      );
    }
  }
}
