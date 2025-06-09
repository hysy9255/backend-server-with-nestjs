import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository.interface';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OrderEntity } from '../domain/order.entity';
import { OrderMapper } from '../mapper/order.mapper';
import { OrderDTO, OrderDTOForOwner } from '../dtos/order.dto';
import { CustomerMapper } from 'src/user/mapper/customer.mapper';
import { CustomerRepository } from 'src/user/repositories/interfaces/customer-repository.interface';
import { OwnerOrderSummary } from '../projections/orderSummaryForOwner.projection';

@Injectable()
export class OwnerOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
  ) {}

  // async getOrders(owner: OwnerEntity): Promise<OrderDTOForOwner[]> {
  //   if (!owner.hasRestaurant()) {
  //     throw new Error("You don't have a registered restaurant yet!");
  //   }

  //   const orderRecords =
  //     await this.orderRepository.findWithCustomerInfoByRestaurantId(
  //       owner.restaurantId!,
  //     );

  //   return orderRecords.map(
  //     (orderRecord) =>
  //       new OrderDTOForOwner(
  //         OrderMapper.toDomain(orderRecord),
  //         CustomerMapper.toDomain(orderRecord.customer),
  //       ),
  //   );
  // }

  async getOrders(owner: OwnerEntity): Promise<OwnerOrderSummary[]> {
    if (!owner.hasRestaurant()) {
      throw new Error("You don't have a registered restaurant yet!");
    }

    const orderProjections =
      await this.orderRepository.findOrderSummariesByRestaurant(
        owner.restaurantId!,
      );

    return orderProjections;
  }

  async getOrder(
    owner: OwnerEntity,
    orderId: string,
  ): Promise<OwnerOrderSummary> {
    if (!owner.hasRestaurant()) {
      throw new Error("You don't have a registered restaurant yet!");
    }

    const orderProjection =
      await this.orderRepository.findSummaryForOwner(orderId);

    if (!orderProjection) {
      throw new Error('Order is not found');
    }

    if (!owner.ownsRestaurantOf(orderProjection.restaurantId)) {
      throw new Error('You do not own the restaurant for this order');
    }

    return orderProjection;
  }

  // async getOrder(
  //   owner: OwnerEntity,
  //   orderId: string,
  // ): Promise<OrderDTOForOwner> {
  //   if (!owner.hasRestaurant()) {
  //     throw new Error("You don't have a registered restaurant yet!");
  //   }

  //   const order = await this.getOrderOrThrow(orderId);
  //   this.validateOrderAccessRights(order, owner);

  //   const customerRecord = await this.customerRepository.findById(
  //     order.customerId,
  //   );

  //   if (!customerRecord) {
  //     throw new Error('Customer is not found');
  //   }

  //   const customer = CustomerMapper.toDomain(customerRecord);

  //   return new OrderDTOForOwner(order, customer);
  // }

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

  private async getOrderOrThrow(orderId: string): Promise<OrderEntity> {
    const orderEntity = await this.orderRepository.findOneById(orderId);
    if (!orderEntity) {
      throw new Error('Order not found');
    }
    return OrderMapper.toDomain(orderEntity);
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
}
