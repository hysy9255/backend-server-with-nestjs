import { OrderRecord } from '../orm-records/order.record';
import { UserRecord } from 'src/user/orm-records/user.record';

export interface OrderRepository {
  save(order: OrderRecord): Promise<OrderRecord>;
  findOneById(id: string): Promise<OrderRecord | null>;
  findOneWithFullRelationById(id: string): Promise<OrderRecord | null>;
  findHistoryByUserId(userId: string): Promise<OrderRecord[]>;
  findByRestaurant(restaurantId: string): Promise<OrderRecord[]>;
  findAvailableOrdersForDriver(driver: UserRecord): Promise<OrderRecord[]>;
}
