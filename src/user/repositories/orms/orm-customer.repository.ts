import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CustomerRepository } from '../interfaces/customer-repository.interface';
import { CustomerOrmEntity } from 'src/user/orm-entities/customer.orm.entity';

@Injectable()
export class OrmCustomerRepository implements CustomerRepository {
  constructor(private readonly em: EntityManager) {}

  async save(customer: CustomerOrmEntity): Promise<void> {
    await this.em.save(CustomerOrmEntity, customer);
  }

  async findByUserId(userId: string): Promise<CustomerOrmEntity | null> {
    return await this.em.findOne(CustomerOrmEntity, {
      where: { userId },
    });
  }

  async findById(id: string): Promise<CustomerOrmEntity | null> {
    return await this.em.findOne(CustomerOrmEntity, {
      where: { id },
    });
  }
}
