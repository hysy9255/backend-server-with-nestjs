import { Inject, Injectable } from '@nestjs/common';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { OrderRepository } from '../repositories/order-repository.interface';
import { CreateOrderInput } from '../dtos/createOrderInput.dto';
import { OrderEntity } from '../domain/order.entity';
import { OrderMapper } from '../mapper/order.mapper';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import {
  OrderPreviewDTOForClient,
  OrderSummaryDTOForClient,
} from '../dtos/order.dto';

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
  ): Promise<OrderSummaryDTOForClient> {
    const order = await this.orderRepository.findSummaryForClient(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // customer.ensureOwnsOrderOf(order);
    if (!customer.idMatches(order.customerId)) {
      throw new Error("You don't own this order");
    }

    return order;
  }

  // used
  async getOrderHistory(
    customer: CustomerEntity,
  ): Promise<OrderPreviewDTOForClient[]> {
    return await this.orderRepository.findDeliveredOrdersByCustomer(
      customer.id,
    );
  }

  // used
  async getOnGoingOrder(
    customer: CustomerEntity,
  ): Promise<OrderSummaryDTOForClient> {
    const order = await this.orderRepository.findOnGoingOrderForClient(
      customer.id,
    );

    if (!order) {
      throw new Error('Currently there is no on going order');
    }

    return order;
  }
}
