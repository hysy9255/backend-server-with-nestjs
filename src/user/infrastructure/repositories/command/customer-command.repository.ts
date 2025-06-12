import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ICustomerCommandRepository } from '../../../application/command/repositories/customer-command.repository.interface';
import { CustomerOrmEntity } from '../../orm-entities/customer.orm.entity';
import { CustomerProjection } from 'src/user/application/command/projections/customer.projection';

@Injectable()
export class CustomerCommandRepository implements ICustomerCommandRepository {
  constructor(private readonly em: EntityManager) {}

  async save(customer: CustomerOrmEntity): Promise<void> {
    await this.em.save(CustomerOrmEntity, customer);
  }

  async findByUserId(userId: string): Promise<CustomerProjection | null> {
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
