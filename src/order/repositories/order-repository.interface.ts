import { OwnerOrderSummaryProjection } from '../projections/orderSummaryForOwner.projection';
import { OrderOrmEntity } from '../orm-entities/order.orm.entity';
import { DriverOrderSummaryProjection } from '../projections/orderSummaryForDriver.projection';
import { OrderSummaryForClient } from '../projections/orderSummaryForClient.projection';
import { OrderPreviewForClient } from '../projections/deliveredOrdersForCustomer.projection';
import { OrderProjectionForEntity } from '../projections/order.projection';

export interface OrderRepository {
  // orm based operations
  // used
  save(order: OrderOrmEntity): Promise<void>;
  // used
  findOneById(id: string): Promise<OrderOrmEntity | null>;

  // raw query based operations
  // used
  findSummaryForClient(orderId: string): Promise<OrderSummaryForClient | null>;

  // used
  findDeliveredOrdersByCustomer(
    customerId: string,
  ): Promise<OrderPreviewForClient[]>;

  // used
  findOnGoingOrderForClient(
    customerId: string,
  ): Promise<OrderSummaryForClient | null>;

  // used
  findOrderSummariesByRestaurant(
    restaurantId: string,
  ): Promise<OwnerOrderSummaryProjection[]>;

  // used
  findOrderSummaryForOwner(
    orderId: string,
  ): Promise<OwnerOrderSummaryProjection | null>;

  // used
  findAvailableOrdersForDriver(
    driverId: string,
  ): Promise<DriverOrderSummaryProjection[]>;

  // used
  findOrderSummaryForDriver(
    orderId: string,
  ): Promise<DriverOrderSummaryProjection>;

  // used
  findOneForDriverById(
    orderId: string,
  ): Promise<OrderProjectionForEntity | null>;

  // findDeliveredOrdersByCustomerId(customerId: string): Promise<OrderRecord[]>;
  // findByRestaurantId(restaurantId: string): Promise<OrderRecord[]>;
  // findWithCustomerInfoByRestaurantId(
  //   restaurantId: string,
  // ): Promise<OrderRecord[]>;
  // findOneWithCustomerInfoById(id: string): Promise<OrderRecord | null>;
}
