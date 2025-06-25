import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RestaurantService } from 'src/restaurant/application/service/restaurant.service';
import { OrderEntity } from '../../domain/order.entity';
import { OrderMapper } from './mapper/order.mapper';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { IOrderCommandRepository } from '../../infrastructure/repositories/command/order-command.repository.interface';
import { IOrderQueryRepository } from '../../infrastructure/repositories/query/order-query.repository.interface';
import {
  ClientOrderPreviewProjection,
  ClientOrderSummaryProjection,
} from '../../infrastructure/repositories/query/projections/order.projection';
import { CreateOrderInput } from 'src/order/interface/dtos/order-inputs.dto';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';
import { UserRole } from 'src/constants/userRole';
import { UserAuthService } from 'src/user/application/service/user-auth.service';

@Injectable()
export class ClientOrderService {
  constructor(
    private readonly restaurantService: RestaurantService,
    @Inject('IOrderCommandRepository')
    private readonly orderCmdRepo: IOrderCommandRepository,
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,
    private readonly userAuthService: UserAuthService,
  ) {}

  // used
  async createOrder(
    user: UserQueryProjection,
    createOrderInput: CreateOrderInput,
  ): Promise<void> {
    if (user.role !== UserRole.Client) {
      throw new ForbiddenException(
        'Only clients can create orders. Please login as a client.',
      );
    }

    const customer = await this.userAuthService.getCustomerForAuth(user.id);
    if (!customer) throw new NotFoundException('Customer Not Found');

    await this.restaurantService._validateRestaurantExistsOrThrow(
      createOrderInput.restaurantId,
    );

    const order = OrderEntity.createNew(
      createOrderInput.restaurantId,
      customer.id,
    );

    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
  }

  // used
  async getOrderSummaryForClient(
    user: UserQueryProjection,
    orderId: string,
  ): Promise<ClientOrderSummaryProjection> {
    if (user.role !== UserRole.Client) {
      throw new ForbiddenException(
        'Only clients can create orders. Please login as a client.',
      );
    }

    const customer = await this.userAuthService.getCustomerForAuth(user.id);
    if (!customer) throw new NotFoundException('Customer Not Found');

    const order = await this.orderQryRepo.findSummaryForClient(orderId);

    if (!order) throw new NotFoundException('Order Not Found');

    // customer.ensureOwnsOrderOf(order);
    if (!customer.idMatches(order.customerId))
      throw new ForbiddenException('You are not allowed to access this order.');

    return order;
  }

  // used
  async getOrderHistory(
    // customer: CustomerEntity,
    user: UserQueryProjection,
  ): Promise<ClientOrderPreviewProjection[]> {
    if (user.role !== UserRole.Client) {
      throw new ForbiddenException(
        'Only clients can create orders. Please login as a client.',
      );
    }

    const customer = await this.userAuthService.getCustomerForAuth(user.id);
    if (!customer) throw new NotFoundException('Customer Not Found');

    return await this.orderQryRepo.findDeliveredOrdersForCustomer(customer.id);
  }

  // used
  async getOnGoingOrder(
    // customer: CustomerEntity,
    user: UserQueryProjection,
  ): Promise<ClientOrderSummaryProjection> {
    if (user.role !== UserRole.Client) {
      throw new ForbiddenException(
        'Only clients can create orders. Please login as a client.',
      );
    }

    const customer = await this.userAuthService.getCustomerForAuth(user.id);
    if (!customer) throw new NotFoundException('Customer Not Found');

    const order = await this.orderQryRepo.findOnGoingOrderForClient(
      customer.id,
    );

    if (!order)
      throw new NotFoundException('Currently there is no on going order');

    return order;
  }
}
