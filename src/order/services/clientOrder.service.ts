import { Inject, Injectable } from '@nestjs/common';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { OrderRepository } from '../repositories/order-repository.interface';
import { CreateOrderInput, CreateOrderOutput } from '../dtos/createOrder.dto';
import { RestaurantMapper } from 'src/restaurant/mapper/restaurant.mapper';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { OrderEntity } from '../domain/order.entity';
import { OrderMapper } from '../mapper/order.mapper';
import { UserRecord } from 'src/user/orm-records/user.record';
import { UserEntity } from 'src/user/domain/user.entity';

@Injectable()
export class ClientOrderService {
  constructor(
    private readonly restaurantService: RestaurantService,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}
  async createOrder(
    customer: UserEntity,
    createOrderInput: CreateOrderInput,
  ): Promise<void> {
    const restaurant = RestaurantMapper.toDomain(
      await this.restaurantService.getRestaurant({
        id: createOrderInput.restaurantId,
      }),
    );

    // const order = OrderEntity.createNew(restaurant, customer);

    // const orderRecord = OrderMapper.toRecord(order);

    // await this.orderRepository.save(orderRecord);

    await this.orderRepository.save(
      OrderMapper.toRecord(OrderEntity.createNew(restaurant, customer)),
    );
  }

  async getOrder(customer: UserEntity, orderId: string): Promise<void> {
    const orderRecord = await this.orderRepository.findOneById(orderId);
    if (!orderRecord) {
      throw new Error('Order not found');
    }

    const order = OrderMapper.toDomain(orderRecord);

    order.ensureOwnedBy(customer);
    // return order;
    // change domain entity into dto and pass it to controller
  }

  async getOrderHistory(customer: UserRecord): Promise<void> {
    const orderRecords = await this.orderRepository.findHistoryByUserId(
      customer.id,
    );
    const orders = orderRecords.map((record) => OrderMapper.toDomain(record));
    const orderDTOs = orders.map(
      (order) =>
        // new OrderOutput(order), // 혹은 OrderOutput.from(order)
        order, // 이건 그냥 지금 임시로 해논거임
    );
    // return ordersDTOs;
  }
}
