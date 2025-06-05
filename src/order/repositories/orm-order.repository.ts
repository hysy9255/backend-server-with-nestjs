import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderRepository } from './order-repository.interface';

import { OrderStatus } from 'src/constants/orderStatus';

import { Brackets } from 'typeorm';
import { OrderRecord } from '../orm-records/order.record';
import { UserRecord } from 'src/user/orm-records/user.record';
import { DriverRecord } from 'src/user/orm-records/driver.record';

@Injectable()
export class OrmOrderRepository implements OrderRepository {
  constructor(private readonly em: EntityManager) {}

  async save(order: OrderRecord): Promise<OrderRecord> {
    return this.em.save(order);
  }

  async findOneById(id: string): Promise<OrderRecord | null> {
    return this.em.findOne(OrderRecord, {
      where: { id },
      relations: ['driver', 'restaurant', 'customer'],
    });
  }

  async findOneWithFullRelationById(id: string): Promise<OrderRecord | null> {
    return this.em.findOne(OrderRecord, {
      where: { id },
      relations: ['driver', 'restaurant', 'customer', 'rejectedByDrivers'],
    });
  }

  async findDeliveredOrdersByCustomerId(
    customerId: string,
  ): Promise<OrderRecord[]> {
    return this.em.find(OrderRecord, {
      where: { customerId, status: OrderStatus.Delivered },
    });
  }

  // async findByRestaurant(restaurantId: string): Promise<OrderRecord[]> {
  //   return this.em.find(OrderRecord, {
  //     where: { restaurant: { id: restaurantId } },
  //   });
  // }

  async findByRestaurantId(restaurantId: string): Promise<OrderRecord[]> {
    return this.em.find(OrderRecord, {
      where: { restaurantId },
    });
  }

  async findWithCustomerInfoByRestaurantId(
    restaurantId: string,
  ): Promise<OrderRecord[]> {
    return this.em.find(OrderRecord, {
      where: { restaurantId },
      relations: ['customer'],
    });
  }

  async findOneWithCustomerInfoById(id: string): Promise<OrderRecord | null> {
    return this.em.findOne(OrderRecord, {
      where: { id },
      relations: ['customer'],
    });
  }

  async findAvailableOrdersForDriver2(
    driverId: string,
  ): Promise<OrderRecord[]> {
    return (
      this.em
        .getRepository(OrderRecord)
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.rejectedDrivers', 'rejected') // 여기서 함께 불러옴
        // .select(['order.id', 'order.status', 'order.restaurantId'])
        // .leftJoin('order.rejectedDrivers', 'rejected')
        // .where('order.status IN (:...statuses)', {
        //   statuses: [OrderStatus.Accepted, OrderStatus.Ready],
        // })
        // .andWhere(
        //   new Brackets((qb) => {
        //     qb.where('rejected.id IS NULL').orWhere('rejected.id != :driverId', {
        //       driverId: driver.id,
        //     });
        //   }),
        // )
        .getMany()
    );
  }

  async findAvailableOrdersForDriver(driverId: string): Promise<OrderRecord[]> {
    return this.em
      .getRepository(OrderRecord)
      .createQueryBuilder('order')
      .leftJoin('order.rejectedDrivers', 'rejected')
      .leftJoin('order.customer', 'customer')
      .select([
        'order.id AS "id"',
        'order.restaurantId AS "restaurantId"',
        'order.customerId AS "customerId"',
        'order.status AS "status"',
        'customer.deliveryAddress AS "deliveryAddress"',
      ])
      .where('order.status IN (:...statuses)', {
        statuses: ['Ready', 'Accepted'],
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('rejected.id IS NULL').orWhere('rejected.id != :driverId', {
            driverId,
          });
        }),
      )
      .getRawMany();
  }

  // async findAvailableOrdersForDriver(
  //   driver: DriverRecord,
  // ): Promise<OrderRecord[]> {
  //   return (
  //     this.em
  //       .getRepository(OrderRecord)
  //       .createQueryBuilder('order')
  //       .leftJoin('order.rejectedDrivers', 'rejected')
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
