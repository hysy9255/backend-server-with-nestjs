import { Inject, Injectable } from '@nestjs/common';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { OrderRepository } from '../repositories/order-repository.interface';
import { CreateOrderInput } from '../dtos/createOrder.dto';
import { OrderEntity } from '../domain/order.entity';
import { OrderMapper } from '../mapper/order.mapper';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { OrderSummaryForClient } from '../projections/orderSummaryForClient.projection';
import { OrderPreviewForClient } from '../projections/deliveredOrdersForCustomer.projection';

@Injectable()
export class ClientOrderService {
  constructor(
    private readonly restaurantService: RestaurantService,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  // used
  async createOrder(
    customer: CustomerEntity,
    createOrderInput: CreateOrderInput,
  ): Promise<void> {
    await this.restaurantService._validateRestaurantExistsOrThrow(
      createOrderInput.restaurantId,
    );

    const order = OrderEntity.createNew(
      createOrderInput.restaurantId,
      customer.id,
    );

    await this.orderRepository.save(OrderMapper.toOrmEntity(order));
  }

  // used
  async getOrderSummaryForClient(
    customer: CustomerEntity,
    orderId: string,
  ): Promise<OrderSummaryForClient> {
    const orderProjection =
      await this.orderRepository.findSummaryForClient(orderId);

    if (!orderProjection) {
      throw new Error('Order not found');
    }

    customer.ensureOwnsOrderOf(orderProjection);

    return orderProjection;
  }

  // used
  async getOrderHistory(
    customer: CustomerEntity,
  ): Promise<OrderPreviewForClient[]> {
    const deliveredOrdersProjections =
      await this.orderRepository.findDeliveredOrdersByCustomer(customer.id);

    return deliveredOrdersProjections;
  }

  // used
  async getOnGoingOrder(
    customer: CustomerEntity,
  ): Promise<OrderSummaryForClient> {
    const onGoingOrder = await this.orderRepository.findOnGoingOrderForClient(
      customer.id,
    );

    if (!onGoingOrder) {
      throw new Error('Currently there is no on going order');
    }

    return onGoingOrder;
  }
}
