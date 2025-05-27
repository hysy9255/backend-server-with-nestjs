import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/user.entity';
// import {
//   CreateOrderInput,
//   CreateOrderOutput,
// } from '../dtos/createOrder.dto';
import { Order } from '../domain/order.entity';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { OrderRepository } from '../repositories/order-repository.interface';
import { CreateOrderInput, CreateOrderOutput } from '../dtos/createOrder.dto';

@Injectable()
export class ClientOrderService {
  constructor(
    private readonly restaurantService: RestaurantService,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}
  async createOrder(
    customer: User,
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    const restaurant = await this.restaurantService.getRestaurant({
      id: createOrderInput.restaurantId,
    });

    const { id } = await this.orderRepository.save(
      new Order(customer, restaurant),
    );

    return { id };
  }

  async getOrder(customer: User, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOneById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.customer.id !== customer.id) {
      throw new Error('You do not own this order');
    }
    return order;
  }

  async getOrderHistory(customer: User): Promise<Order[]> {
    const customerId = customer.id;
    const orders = await this.orderRepository.findHistoryByUserId(customerId);
    return orders;
  }
}
