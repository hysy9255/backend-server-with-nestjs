import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IOrderQueryRepository } from './order-query.repository.interface';
import {
  ClientOrderPreviewProjection,
  ClientOrderSummaryProjection,
  DriverOrderSummaryProjection,
  OwnerOrderSummaryProjection,
} from 'src/order/infrastructure/repositories/query/projections/order.projection';

@Injectable()
export class OrderQueryRepository implements IOrderQueryRepository {
  constructor(private readonly em: EntityManager) {}

  // used
  async findSummaryForClient(
    orderId: string,
  ): Promise<ClientOrderSummaryProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'customer.deliveryAddress AS "deliveryAddress"',
        'order.customerId AS "customerId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
      ])
      .from('order', 'order')
      .leftJoin('customer', 'customer', 'customer.id = order.customerId')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .where('order.id = :id', { id: orderId })
      .getRawOne();

    // return result ? new OrderSummaryDTOForClient(result) : null;
    return result;
  }

  // used
  async findDeliveredOrdersForCustomer(
    customerId: string,
  ): Promise<ClientOrderPreviewProjection[]> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
      ])
      .from('order', 'order')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .where('order.customerId = :customerId AND order.status = :status', {
        customerId,
        status: 'Delivered',
      })
      .getRawMany();

    // return result.map((order) => new OrderPreviewDTOForClient(order));
    return result;
  }

  // used
  async findOnGoingOrderForClient(
    customerId: string,
  ): Promise<ClientOrderSummaryProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'customer.deliveryAddress AS "deliveryAddress"',
        'order.customerId AS "customerId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
      ])
      .from('order', 'order')
      .leftJoin('customer', 'customer', 'customer.id = order.customerId')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .where('order.customerId = :customerId', { customerId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: ['Pending', 'Accepted', 'Ready', 'PickedUp'],
      })
      .getRawOne();

    return result;
  }

  // used
  async findOrderSummariesForOwner(
    restaurantId: string,
  ): Promise<OwnerOrderSummaryProjection[]> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'customer.deliveryAddress AS "deliveryAddress"',
        'order.customerId AS "customerId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
      ])
      .from('order', 'order')
      .leftJoin('customer', 'customer', 'customer.id = order.customerId')
      .where('order.restaurantId = :restaurantId', { restaurantId })
      .getRawMany();

    // return result.map((order) => new OrderSummaryDTOForOwner(order));
    return result;
  }

  // used
  async findOrderSummaryForOwner(
    id: string,
  ): Promise<OwnerOrderSummaryProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'customer.deliveryAddress AS "deliveryAddress"',
        'order.customerId AS "customerId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
      ])
      .from('order', 'order')
      .leftJoin('customer', 'customer', 'customer.id = order.customerId')
      .where('order.id = :id', { id })
      .getRawOne();

    return result;
    // return result ? new OrderSummaryDTOForOwner(result) : null;
    // return new OrderSummaryDTOForOwner(result);
  }

  // used
  async findAvailableOrdersForDriver(
    driverId: string,
  ): Promise<DriverOrderSummaryProjection[]> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS "id"',
        'order.status AS status',
        'customer.deliveryAddress AS "deliveryAddress"',
        'order.customerId AS "customerId"',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
      ])
      .from('order', 'order')
      .leftJoin('customer', 'customer', 'customer.id = order.customerId')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .leftJoin(
        'order_driver_rejection',
        'odr',
        'odr.orderId = order.id AND odr.driverId = :driverId',
        { driverId },
      )
      .where('order.status IN (:...statuses)', {
        statuses: ['Ready', 'Accepted'],
      })
      .andWhere('odr.id IS NULL')
      .getRawMany();

    // return result.map((order) => new OrderSummaryDTOForDriver(order));
    return result;
  }

  // used
  async findOrderSummaryForDriver(
    orderId: string,
  ): Promise<DriverOrderSummaryProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'customer.deliveryAddress AS "deliveryAddress"',
        'customer.id AS "customerId"',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
        'order.driverId AS "driverId"',
      ])
      .from('order', 'order')
      .leftJoin('customer', 'customer', 'customer.id = order.customerId')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .where('order.id = :id', { id: orderId })
      .getRawOne();

    // return result ? new OrderSummaryDTOForDriver(result) : result;
    return result;
  }
}
