import {
  OrderForClient,
  OrderForDriver,
  OrderForOwner,
} from './projections/order.projection';

// prettier-ignore
export interface IOrderQueryRepository {
  findOneById(orderId: string);
  findOneForClient(orderId: string): Promise<OrderForClient>;
  findDeliveredForClient(clientId: string): Promise<Partial<OrderForClient>[]>;
  findOnGoingForClient(clientId: string): Promise<OrderForClient | null>;
  findManyForOwner(restaurantId: string): Promise<OrderForOwner[]>;
  findOneForOwner(orderId: string): Promise<OrderForOwner>;
  findAvailableForDriver(driverId: string): Promise<OrderForDriver[]>;
  findOneForDriver(orderId: string): Promise<OrderForDriver>;
}
