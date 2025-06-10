import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderDriverRejectionRepository } from './order-driver-rejection-repository.interface';
import { OrderDriverRejectionOrmEntity } from '../orm-entities/order-driver-rejection.orm';

@Injectable()
export class OrmOrderDriverRejectionRepository
  implements OrderDriverRejectionRepository
{
  constructor(private readonly em: EntityManager) {}

  // used
  async save(order: OrderDriverRejectionOrmEntity): Promise<void> {
    this.em.save(order);
  }
}
