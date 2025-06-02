import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository.interface';
import { OrderDTO } from '../dtos/order.dto';
import { OrderMapper } from '../mapper/order.mapper';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { DriverMapper } from 'src/user/mapper/driver.mapper';
import { OrderEntity } from '../domain/order.entity';

@Injectable()
export class DriverOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async availableOrders(driver: DriverEntity): Promise<OrderDTO[]> {
    const driverRecord = DriverMapper.toRecord(driver);
    const orderRecords =
      await this.orderRepository.findAvailableOrdersForDriver(driverRecord);

    const orderEntities = orderRecords.map((orderRecord) =>
      OrderMapper.toDomain(orderRecord),
    );

    return orderEntities.map((orderEntity) => new OrderDTO(orderEntity));
  }

  async acceptOrder(orderId: string, driver: DriverEntity): Promise<any> {
    const order = await this.getOrderOrThrow(orderId);
    order.assignDriver(driver);
    const orderRecord = OrderMapper.toRecord(order);
    return await this.orderRepository.save(orderRecord);
  }

  async rejectOrder(orderId: string, driver: DriverEntity): Promise<any> {
    const order = await this.getOrderOrThrow(orderId);
    order.markRejectedByDriver(driver);
    const orderRecord = OrderMapper.toRecord(order);
    return await this.orderRepository.save(orderRecord);
  }

  async pickupOrder(orderId: string, driver: DriverEntity): Promise<any> {
    const order = await this.getOrderOrThrow(orderId);
    order.markPickedUp(driver);
    const orderRecord = OrderMapper.toRecord(order);
    return await this.orderRepository.save(orderRecord);
  }

  async completeOrder(orderId: string, driver: DriverEntity): Promise<any> {
    const order = await this.getOrderOrThrow(orderId);
    order.markDelivered(driver);
    const orderRecord = OrderMapper.toRecord(order);
    return await this.orderRepository.save(orderRecord);
  }

  private async getOrderOrThrow(orderId: string): Promise<OrderEntity> {
    const orderRecord = await this.orderRepository.findOneById(orderId);
    if (!orderRecord) {
      throw new Error('Order not found');
    }
    return OrderMapper.toDomain(orderRecord);
  }
}
