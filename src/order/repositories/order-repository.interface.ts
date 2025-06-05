import { DriverRecord } from 'src/user/orm-records/driver.record';
import { OrderRecord } from '../orm-records/order.record';
import { UserRecord } from 'src/user/orm-records/user.record';

export interface OrderRepository {
  save(order: OrderRecord): Promise<OrderRecord>;
  findOneById(id: string): Promise<OrderRecord | null>;
  findOneWithFullRelationById(id: string): Promise<OrderRecord | null>;
  // findHistoryByUserId(userId: string): Promise<OrderRecord[]>;
  findDeliveredOrdersByCustomerId(customerId: string): Promise<OrderRecord[]>;
  // findByRestaurant(restaurantId: string): Promise<OrderRecord[]>;
  findByRestaurantId(restaurantId: string): Promise<OrderRecord[]>;
  findWithCustomerInfoByRestaurantId(
    restaurantId: string,
  ): Promise<OrderRecord[]>;
  findOneWithCustomerInfoById(id: string): Promise<OrderRecord | null>;
  // findAvailableOrdersForDriver(driver: DriverRecord): Promise<OrderRecord[]>;
  findAvailableOrdersForDriver(driverId: string): Promise<OrderRecord[]>;
}
