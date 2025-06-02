import { Inject, Injectable } from '@nestjs/common';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { OrderRepository } from '../repositories/order-repository.interface';
import { CreateOrderInput } from '../dtos/createOrder.dto';
import { OrderEntity } from '../domain/order.entity';
import { OrderMapper } from '../mapper/order.mapper';
import { UserRecord } from 'src/user/orm-records/user.record';
import { UserEntity } from 'src/user/domain/user.entity';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { OrderDTO } from '../dtos/order.dto';

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
  ): Promise<void> {
    const restaurant = await this.restaurantService.getRestaurantEntityById(
      createOrderInput.restaurantId,
    );

    const order = OrderEntity.createNew(restaurant, customer);

    await this.orderRepository.save(OrderMapper.toRecord(order));
  }

  async getOrder(customer: CustomerEntity, orderId: string): Promise<OrderDTO> {
    const orderRecord = await this.orderRepository.findOneById(orderId);
    if (!orderRecord) {
      throw new Error('Order not found');
    }

    const order = OrderMapper.toDomain(orderRecord);
    order.ensureOwnedBy(customer);

    return new OrderDTO(order);
  }

  async getOrderHistory(customer: UserRecord): Promise<OrderDTO[]> {
    const orderRecords = await this.orderRepository.findHistoryByUserId(
      customer.id,
    );
    const orders = orderRecords.map((record) => OrderMapper.toDomain(record));

    return orders.map((order) => new OrderDTO(order));
  }
}
