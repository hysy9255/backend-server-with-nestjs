import { Inject, Injectable } from '@nestjs/common';
import { OrderEntity } from '../../domain/order.entity';
import { IOrderCommandRepository } from '../../infrastructure/repositories/command/order-command.repository.interface';
import { OrderMapper } from '../order.mapper';

@Injectable()
export class OrderInternalService {
  constructor(
    @Inject('IOrderCommandRepository')
    private readonly orderCmdRepo: IOrderCommandRepository,
  ) {}

  async _getOrder(orderId: string): Promise<OrderEntity> {
    return OrderMapper.toDomain(await this.orderCmdRepo.findOneById(orderId));
  }
}
