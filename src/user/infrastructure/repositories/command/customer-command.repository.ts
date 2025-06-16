import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CustomerOrmEntity } from '../../orm-entities/customer.orm.entity';
import {
  CustomerCmdProjection,
  ICustomerCommandRepository,
} from './customer-command.repository.interface';

@Injectable()
export class CustomerCommandRepository implements ICustomerCommandRepository {
  constructor(private readonly em: EntityManager) {}

  async save(customer: CustomerOrmEntity): Promise<void> {
    await this.em.save(CustomerOrmEntity, customer);
  }

  async findByUserId(userId: string): Promise<CustomerCmdProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'customer.id AS id',
        'customer.userId AS "userId"',
        'customer.deliveryAddress AS "deliveryAddress"',
      ])
      .from('customer', 'customer')
      .where('customer.userId = :userId', { userId })
      .getRawOne();

    return result;
  }
}
