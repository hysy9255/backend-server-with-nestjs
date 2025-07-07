import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IOrderQueryRepository } from 'src/order/infrastructure/repositories/query/order-query.repository.interface';
import { IRestaurantQueryRepository } from 'src/restaurant/infrastructure/repositories/query/retaurant-query.repository.interface';

@Injectable()
export class OrderAccessPolicy {
  constructor(
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,
    @Inject('IRestaurantQueryRepository')
    private readonly restaurantQryRepo: IRestaurantQueryRepository,
  ) {}

  async assertOwnerCanAccessOrder(
    ownerId: string,
    orderId: string,
  ): Promise<void> {
    const order = await this.orderQryRepo.findOneById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    const restaurant = await this.restaurantQryRepo.findOneById(
      order.restaurantId,
    );
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('해당 오더를 볼 수 없습니다');
    }
  }
}
