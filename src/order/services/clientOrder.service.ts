import { Inject, Injectable } from '@nestjs/common';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { OrderRepository } from '../repositories/order-repository.interface';
import { CreateOrderInput } from '../dtos/createOrder.dto';
import { OrderEntity } from '../domain/order.entity';
import { OrderMapper } from '../mapper/order.mapper';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { ClientOrderSummary } from '../projections/orderSummaryForClient.projection';
import { DeliveredOrderPreview } from '../projections/deliveredOrdersForCustomer.projection';

@Injectable()
export class ClientOrderService {
  constructor(
    private readonly restaurantService: RestaurantService,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}
  async createOrder(
    customer: CustomerEntity,
    createOrderInput: CreateOrderInput,
  ): Promise<boolean> {
    const restaurant = await this.restaurantService.getRestaurantById(
      createOrderInput.restaurantId,
    );

    const order = OrderEntity.createNew(restaurant.id, customer.id);

    await this.orderRepository.save(OrderMapper.toRecord(order));

    return true;
  }

  async getOrder(
    customer: CustomerEntity,
    orderId: string,
  ): Promise<ClientOrderSummary> {
    const orderProjection =
      await this.orderRepository.findSummaryForClient(orderId);

    if (!orderProjection) {
      throw new Error('Order not found');
    }

    customer.ensureOwnsOrderOf(orderProjection);

    return orderProjection;
  }

  async getOrderHistory(
    customer: CustomerEntity,
  ): Promise<DeliveredOrderPreview[]> {
    const deliveredOrdersProjections =
      await this.orderRepository.findDeliveredByCustomer(customer.id);

    return deliveredOrdersProjections;
  }
}
