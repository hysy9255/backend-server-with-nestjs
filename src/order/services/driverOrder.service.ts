import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository.interface';
import { OrderMapper } from '../mapper/order.mapper';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { OrderEntity } from '../domain/order.entity';
import { DriverOrderSummaryProjection } from '../projections/orderSummaryForDriver.projection';
import { OrderDriverRejectionRepository } from '../repositories/order-driver-rejection-repository.interface';
import { OrderDriverRejectionOrmEntity } from '../orm-entities/order-driver-rejection.orm';

@Injectable()
export class DriverOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('OrderDriverRejectionRepository')
    private readonly orderDriverRejectionRepository: OrderDriverRejectionRepository,
  ) {}

  // used
  async getOrdersForDriver(
    driver: DriverEntity,
  ): Promise<DriverOrderSummaryProjection[]> {
    return await this.orderRepository.findAvailableOrdersForDriver(driver.id);
  }

  // async getCompletedOrdersForDriver() {}

  // used
  async getOrderForDriver(
    driver: DriverEntity,
    orderId: string,
  ): Promise<DriverOrderSummaryProjection> {
    const order = await this.orderRepository.findOrderSummaryForDriver(orderId);
    driver.ensureCanAccessOrderOf(order);
    return order;
  }

  // used
  async acceptOrder(orderId: string, driver: DriverEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    order.assignDriver(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    await this.orderRepository.save(orderRecord);
  }

  // used
  async rejectOrder(orderId: string, driver: DriverEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    order.markRejectedByDriver(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    await this.orderRepository.save(orderRecord);
    await this.orderDriverRejectionRepository.save(
      new OrderDriverRejectionOrmEntity(orderId, driver.id),
    );
  }

  // used
  async pickupOrder(orderId: string, driver: DriverEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    order.markPickedUp(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    return await this.orderRepository.save(orderRecord);
  }

  // used
  async completeDelivery(orderId: string, driver: DriverEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    order.markDelivered(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    return await this.orderRepository.save(orderRecord);
  }

  // used
  private async _getOrderOrThrow(orderId: string): Promise<OrderEntity> {
    const projection = await this.orderRepository.findOneForDriverById(orderId);
    if (!projection) {
      throw new Error('Order not found');
    }
    return OrderMapper.toDomain(projection);
  }
}
