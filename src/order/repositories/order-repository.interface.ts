import { Restaurant } from 'src/restaurant/domain/restaurant.entity';
import { User } from 'src/user/domain/user.entity';
import { Order } from '../domain/order.entity';
import { OrderStatus } from 'src/constants/orderStatus';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findOneById(id: string): Promise<Order | null>;
  findOneWithFullRelationById(id: string): Promise<Order | null>;
  findHistoryByUserId(userId: string): Promise<Order[]>;
  findByRestaurant(restaurantId: string): Promise<Order[]>;
  findAvailableOrdersForDriver(driver: User): Promise<Order[]>;

  //   find(): Promise<Restaurant[]>;
  //   findOneByOwner(user: User): Promise<Restaurant | null>;
}
