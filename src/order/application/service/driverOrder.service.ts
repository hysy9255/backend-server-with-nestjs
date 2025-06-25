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
import { IOrderCommandRepository } from '../../infrastructure/repositories/command/order-command.repository.interface';
import { IOrderQueryRepository } from '../../infrastructure/repositories/query/order-query.repository.interface';
import { OrderDriverRejectionCommandRepository } from '../../infrastructure/repositories/command/order-driver-rejection-command.repository';
import { DriverOrderSummaryProjection } from '../../infrastructure/repositories/query/projections/order.projection';
import { UserAuthService } from 'src/user/application/service/user-auth.service';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';
import { UserRole } from 'src/constants/userRole';

@Injectable()
export class DriverOrderService {
  constructor(
    @Inject('IOrderDriverRejectionCommandRepository')
    private readonly orderDriverRejectCmdRepo: OrderDriverRejectionCommandRepository,
    @Inject('IOrderCommandRepository')
    private readonly orderCmdRepo: IOrderCommandRepository,
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,
    private readonly userAuthService: UserAuthService,
  ) {}

  // used
  async getOrdersForDriver(
    // driver: DriverEntity,
    user: UserQueryProjection,
  ): Promise<DriverOrderSummaryProjection[]> {
    if (user.role !== UserRole.Delivery) {
      throw new ForbiddenException('Invalid request');
    }

    const driver = await this.userAuthService.getDriverForAuth(user.id);
    if (!driver) throw new NotFoundException('Driver Not Found');

    return await this.orderQryRepo.findAvailableOrdersForDriver(driver.id);
  }

  // async getCompletedOrdersForDriver() {}

  // used
  async getOrderForDriver(
    // driver: DriverEntity,
    user: UserQueryProjection,
    orderId: string,
  ): Promise<DriverOrderSummaryProjection> {
    if (user.role !== UserRole.Delivery) {
      throw new ForbiddenException('Invalid request');
    }

    const driver = await this.userAuthService.getDriverForAuth(user.id);
    if (!driver) throw new NotFoundException('Driver Not Found');

    const order = await this.orderQryRepo.findOrderSummaryForDriver(orderId);
    if (!order) throw new NotFoundException('Order Not Found');

    if (!driver.canAccessOrderOf(order))
      throw new ForbiddenException('You are not allowed to access this order.');

    return order;
  }

  // used
  async acceptOrder(
    orderId: string,
    // driver: DriverEntity,
    user: UserQueryProjection,
  ): Promise<void> {
    if (user.role !== UserRole.Delivery) {
      throw new ForbiddenException('Invalid request');
    }

    const driver = await this.userAuthService.getDriverForAuth(user.id);
    if (!driver) throw new NotFoundException('Driver Not Found');

    const order = await this._getOrderOrThrow(orderId);
    order.assignDriver(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    await this.orderCmdRepo.save(orderRecord);
  }

  // used
  async rejectOrder(orderId: string, user: UserQueryProjection): Promise<void> {
    if (user.role !== UserRole.Delivery) {
      throw new ForbiddenException('Invalid request');
    }

    const driver = await this.userAuthService.getDriverForAuth(user.id);
    if (!driver) throw new NotFoundException('Driver Not Found');

    const order = await this._getOrderOrThrow(orderId);
    order.markRejectedByDriver(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    await this.orderCmdRepo.save(orderRecord);
    await this.orderDriverRejectCmdRepo.save(
      new OrderDriverRejectionOrmEntity(orderId, driver.id),
    );
  }

  // used
  async pickupOrder(orderId: string, user: UserQueryProjection): Promise<void> {
    if (user.role !== UserRole.Delivery) {
      throw new ForbiddenException('Invalid request');
    }

    const driver = await this.userAuthService.getDriverForAuth(user.id);
    if (!driver) throw new NotFoundException('Driver Not Found');

    const order = await this._getOrderOrThrow(orderId);
    order.markPickedUp(driver);
    const orderRecord = OrderMapper.toOrmEntity(order);
    return await this.orderCmdRepo.save(orderRecord);
  }

  // used
  async completeDelivery(
    orderId: string,
    user: UserQueryProjection,
  ): Promise<void> {
    if (user.role !== UserRole.Delivery) {
      throw new ForbiddenException('Invalid request');
    }

    const driver = await this.userAuthService.getDriverForAuth(user.id);
    if (!driver) throw new NotFoundException('Driver Not Found');

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
