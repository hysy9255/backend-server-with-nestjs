import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderMapper } from './mapper/order.mapper';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { OrderEntity } from '../../domain/order.entity';
import { OrderDriverRejectionOrmEntity } from '../../infrastructure/orm-entities/order-driver-rejection.orm';
import { IOrderCommandRepository } from '../command/repositories/order-command.repository.interface';
import { IOrderQueryRepository } from '../query/repositories/order-query.repository.interface';
import { OrderDriverRejectionCommandRepository } from '../../infrastructure/repositories/command/order-driver-rejection-command.repository';
import { DriverOrderSummaryProjection } from '../query/projections/order.projection';

@Injectable()
export class DriverOrderService {
  constructor(
    @Inject('IOrderDriverRejectionCommandRepository')
    private readonly orderDriverRejectCmdRepo: OrderDriverRejectionCommandRepository,
    @Inject('IOrderCommandRepository')
    private readonly orderCmdRepo: IOrderCommandRepository,
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,
  ) {}

  // used
  async getOrdersForDriver(
    driver: DriverEntity,
  ): Promise<DriverOrderSummaryProjection[]> {
    return await this.orderQryRepo.findAvailableOrdersForDriver(driver.id);
  }

  // async getCompletedOrdersForDriver() {}

  // used
  async getOrderForDriver(
    driver: DriverEntity,
    orderId: string,
  ): Promise<DriverOrderSummaryProjection> {
    const order = await this.orderQryRepo.findOrderSummaryForDriver(orderId);
    if (!order) throw new NotFoundException('Order Not Found');

    if (!driver.canAccessOrderOf(order))
      throw new ForbiddenException('You are not allowed to access this order.');

    return order;
  }

  // used
  async acceptOrder(orderId: string, driver: DriverEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    order.assignDriver(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    await this.orderCmdRepo.save(orderRecord);
  }

  // used
  async rejectOrder(orderId: string, driver: DriverEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    order.markRejectedByDriver(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    await this.orderCmdRepo.save(orderRecord);
    await this.orderDriverRejectCmdRepo.save(
      new OrderDriverRejectionOrmEntity(orderId, driver.id),
    );
  }

  // used
  async pickupOrder(orderId: string, driver: DriverEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    order.markPickedUp(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    return await this.orderCmdRepo.save(orderRecord);
  }

  // used
  async completeDelivery(orderId: string, driver: DriverEntity): Promise<void> {
    const order = await this._getOrderOrThrow(orderId);
    order.markDelivered(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    return await this.orderCmdRepo.save(orderRecord);
  }

  // used
  private async _getOrderOrThrow(orderId: string): Promise<OrderEntity> {
    const projection = await this.orderCmdRepo.findOneById(orderId);
    if (!projection) throw new NotFoundException('Order Not Found');

    return OrderMapper.toDomain(projection);
  }
}
