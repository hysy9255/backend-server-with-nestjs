import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository.interface';
import { UserRecord } from 'src/user/orm-records/user.record';

@Injectable()
export class DriverOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async availableOrders(driver: UserRecord): Promise<Order[]> {
    return await this.orderRepository.findAvailableOrdersForDriver(driver);
  }

  async acceptOrder(orderId: string, driver: UserRecord): Promise<any> {
    const order = await this.getOrderOrThrow(orderId);
    order.assignDriver(driver);
    return await this.orderRepository.save(order);
  }

  async rejectOrder(orderId: string, driver: UserRecord): Promise<any> {
    const order = await this.getOrderOrThrow(orderId);
    order.markRejectedByDriver(driver);
    return await this.orderRepository.save(order);
  }

  async pickupOrder(orderId: string, driver: UserRecord): Promise<any> {
    const order = await this.getOrderOrThrow(orderId);
    order.markPickedUp(driver);
    return await this.orderRepository.save(order);
  }

  async completeOrder(orderId: string, driver: UserRecord): Promise<any> {
    const order = await this.getOrderOrThrow(orderId);
    order.markDelivered(driver);
    return await this.orderRepository.save(order);
  }

  private async getOrderOrThrow(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOneById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }
}
