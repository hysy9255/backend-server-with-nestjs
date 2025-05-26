import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/user.entity';
import { CreateOrderInput } from '../dtos/createOrderInput.dto';
import { Order } from '../domain/order.entity';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { OrderRepository } from '../repositories/order-repository.interface';

@Injectable()
export class ClientOrderService {
  constructor(
    private readonly restaurantService: RestaurantService,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}
  async createOrder(
    user: User,
    createOrderInput: CreateOrderInput,
  ): Promise<Order> {
    const restaurant = await this.restaurantService.getRestaurant({
      id: createOrderInput.restaurantId,
    });
    const order = new Order(user, restaurant);
    return await this.orderRepository.save(order);
  }

  async getOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOneById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async getOrderHistory(userId: string): Promise<Order[]> {
    const orders = await this.orderRepository.findHistoryByUserId(userId);
    return orders;
  }
}
