import { Restaurant } from 'src/restaurant/orm-records/restaurant.record';
import { User } from 'src/user/orm-records/user.record';
import { Order } from '../orm-records/order.record';
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
