import { OwnerOrderSummary } from '../projections/orderSummaryForOwner.projection';
import { OrderOrmEntity } from '../orm-entities/order.orm.entity';
import { OrderProjection } from '../projections/order.projection';
import { DeliveredOrderPreview } from '../projections/deliveredOrdersForCustomer.projection';
import { ClientOrderSummary } from '../projections/orderSummaryForClient.projection';

export interface OrderRepository {
  save(order: OrderOrmEntity): Promise<void>;
  findOneById(id: string): Promise<OrderOrmEntity | null>;

  findSummaryForClient(orderId: string): Promise<ClientOrderSummary | null>;

  findSummaryForOwner(orderId: string): Promise<OwnerOrderSummary | null>;

  findOrderSummariesByRestaurant(
    restaurantId: string,
  ): Promise<OwnerOrderSummary[]>;

  findDeliveredByCustomer(customerId: string): Promise<DeliveredOrderPreview[]>;
  // findDeliveredOrdersByCustomerId(customerId: string): Promise<OrderRecord[]>;
  // findByRestaurantId(restaurantId: string): Promise<OrderRecord[]>;
  // findWithCustomerInfoByRestaurantId(
  //   restaurantId: string,
  // ): Promise<OrderRecord[]>;
  // findOneWithCustomerInfoById(id: string): Promise<OrderRecord | null>;
  // findAvailableOrdersForDriver(driverId: string): Promise<OrderRecord[]>;
}
