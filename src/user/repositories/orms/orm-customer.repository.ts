import { Injectable } from '@nestjs/common';
import { OwnerRepository } from '../interfaces/owner-repository.interface';
import { EntityManager } from 'typeorm';
import { OwnerRecord } from '../../orm-records/owner.record';
import { UserRecord } from 'src/user/orm-records/user.record';
import { CustomerRepository } from '../interfaces/customer-repository.interface';
import { CustomerRecord } from 'src/user/orm-records/customer.record';

@Injectable()
export class OrmCustomerRepository implements CustomerRepository {
  constructor(private readonly em: EntityManager) {}

  async save(customer: CustomerRecord): Promise<void> {
    await this.em.save(CustomerRecord, customer);
  }

  async findByUserId(userId: string): Promise<CustomerRecord | null> {
    return await this.em.findOne(CustomerRecord, {
      where: { userId },
    });
  }

  async findById(id: string): Promise<CustomerRecord | null> {
    return await this.em.findOne(CustomerRecord, {
      where: { id },
    });
  }
}
