import { OrderOrmEntity } from '../orm-entities/order.orm.entity';
import { OrderProjectionForEntity } from '../projections/order.projection';
import {
  OrderPreviewDTOForClient,
  OrderSummaryDTOForClient,
  OrderSummaryDTOForDriver,
  OrderSummaryDTOForOwner,
} from '../dtos/order.dto';

export interface OrderRepository {
  // orm based operations
  // used
  save(order: OrderOrmEntity): Promise<void>;
  // used
  findOneById(id: string): Promise<OrderOrmEntity | null>;

  // raw query based operations
  // used
  findSummaryForClient(
    orderId: string,
  ): Promise<OrderSummaryDTOForClient | null>;

  // used
  findDeliveredOrdersByCustomer(
    customerId: string,
  ): Promise<OrderPreviewDTOForClient[]>;

  // used
  findOnGoingOrderForClient(
    customerId: string,
  ): Promise<OrderSummaryDTOForClient | null>;

  // used
  findOrderSummariesByRestaurant(
    restaurantId: string,
  ): Promise<OrderSummaryDTOForOwner[]>;

  // used
  findOrderSummaryForOwner(
    orderId: string,
  ): Promise<OrderSummaryDTOForOwner | null>;

  // used
  findAvailableOrdersForDriver(
    driverId: string,
  ): Promise<OrderSummaryDTOForDriver[]>;

  // used
  findOrderSummaryForDriver(
    orderId: string,
  ): Promise<OrderSummaryDTOForDriver | null>;

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
