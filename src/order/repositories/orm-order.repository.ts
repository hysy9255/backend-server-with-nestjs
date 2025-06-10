import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderRepository } from './order-repository.interface';
import { OrderOrmEntity } from '../orm-entities/order.orm.entity';
import { OwnerOrderSummaryProjection } from '../projections/orderSummaryForOwner.projection';

import { DriverOrderSummaryProjection } from '../projections/orderSummaryForDriver.projection';
import { OrderSummaryForClient } from '../projections/orderSummaryForClient.projection';
import { OrderPreviewForClient } from '../projections/deliveredOrdersForCustomer.projection';
import { OrderProjectionForEntity } from '../projections/order.projection';

@Injectable()
export class OrmOrderRepository implements OrderRepository {
  constructor(private readonly em: EntityManager) {}

  // used
  async save(order: OrderOrmEntity): Promise<void> {
    this.em.save(order);
  }

  // used
  async findOneById(id: string): Promise<OrderOrmEntity | null> {
    return this.em.findOne(OrderOrmEntity, {
      where: { id },
    });
  }

  async findOneForDriverById(
    orderId: string,
  ): Promise<OrderProjectionForEntity | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'order.customerId AS "customerId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
        'array_remove(array_agg(ord.driverId), NULL) AS "rejectedDriverIds"',
      ])
      .from('order', 'order')
      .leftJoin('order_driver_rejection', 'ord', 'ord.orderId = order.id')
      .where('order.id = :id', { id: orderId })
      .groupBy('order.id')
      .getRawOne();

    return result;
  }

  // used
  async findSummaryForClient(
    id: string,
  ): Promise<OrderSummaryForClient | null> {
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
      .where('order.id = :id', { id })
      .getRawOne();

    return result;
  }

  // used
  async findDeliveredOrdersByCustomer(
    customerId: string,
  ): Promise<OrderPreviewForClient[]> {
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

    return result;
  }

  // used
  async findOnGoingOrderForClient(
    customerId: string,
  ): Promise<OrderSummaryForClient | null> {
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
  async findOrderSummariesByRestaurant(
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

    return result;
  }

  // used
  async findOrderSummaryForDriver(
    orderId: string,
  ): Promise<DriverOrderSummaryProjection> {
    const result = this.em
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

    return result;
  }

  // async findAvailableOrdersForDriver(driverId: string): Promise<OrderRecord[]> {
  //   return this.em
  //     .getRepository(OrderRecord)
  //     .createQueryBuilder('order')
  //     .leftJoin('order.rejectedDrivers', 'rejected')
  //     .leftJoin('order.customer', 'customer')
  //     .select([
  //       'order.id AS "id"',
  //       'order.restaurantId AS "restaurantId"',
  //       'order.customerId AS "customerId"',
  //       'order.status AS "status"',
  //       'customer.deliveryAddress AS "deliveryAddress"',
  //     ])
  //     .where('order.status IN (:...statuses)', {
  //       statuses: ['Ready', 'Accepted'],
  //     })
  //     .andWhere(
  //       new Brackets((qb) => {
  //         qb.where('rejected.id IS NULL').orWhere('rejected.id != :driverId', {
  //           driverId,
  //         });
  //       }),
  //     )
  //     .getRawMany();
  // }

  // async findDeliveredOrdersByCustomerId(
  //   customerId: string,
  // ): Promise<OrderRecord[]> {
  //   return this.em.find(OrderRecord, {
  //     where: { customerId, status: OrderStatus.Delivered },
  //   });
  // }

  // async findByRestaurantId(restaurantId: string): Promise<OrderRecord[]> {
  //   return this.em.find(OrderRecord, {
  //     where: { restaurantId },
  //   });
  // }

  // async findWithCustomerInfoByRestaurantId(
  //   restaurantId: string,
  // ): Promise<OrderRecord[]> {
  //   return this.em.find(OrderRecord, {
  //     where: { restaurantId },
  //     relations: ['customer'],
  //   });
  // }

  // async findOneWithCustomerInfoById(id: string): Promise<OrderRecord | null> {
  //   return this.em.findOne(OrderRecord, {
  //     where: { id },
  //     relations: ['customer'],
  //   });
  // }

  // async findAvailableOrdersForDriver2(
  //   driverId: string,
  // ): Promise<OrderRecord[]> {
  //   return (
  //     this.em
  //       .getRepository(OrderRecord)
  //       .createQueryBuilder('order')
  //       .leftJoinAndSelect('order.rejectedDrivers', 'rejected') // 여기서 함께 불러옴
  //       // .select(['order.id', 'order.status', 'order.restaurantId'])
  //       // .leftJoin('order.rejectedDrivers', 'rejected')
  //       // .where('order.status IN (:...statuses)', {
  //       //   statuses: [OrderStatus.Accepted, OrderStatus.Ready],
  //       // })
  //       // .andWhere(
  //       //   new Brackets((qb) => {
  //       //     qb.where('rejected.id IS NULL').orWhere('rejected.id != :driverId', {
  //       //       driverId: driver.id,
  //       //     });
  //       //   }),
  //       // )
  //       .getMany()
  //   );
  // }
}
