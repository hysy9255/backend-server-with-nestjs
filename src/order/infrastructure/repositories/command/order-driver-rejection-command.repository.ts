import { Injectable } from '@nestjs/common';
import { IOrderDriverRejectionCommandRepository } from 'src/order/infrastructure/repositories/command/order-driver-rejection-command.repository.interface';
import { EntityManager } from 'typeorm';
import { OrderDriverRejectionOrmEntity } from '../../orm-entities/order-driver-rejection.orm';

@Injectable()
export class OrderDriverRejectionCommandRepository
  implements IOrderDriverRejectionCommandRepository
{
  constructor(private readonly em: EntityManager) {}

  // used
  async save(order: OrderDriverRejectionOrmEntity): Promise<void> {
    this.em.save(order);
  }
}
