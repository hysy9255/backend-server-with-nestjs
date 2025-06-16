import {
  ClientOrderPreviewProjection,
  ClientOrderSummaryProjection,
  DriverOrderSummaryProjection,
  OwnerOrderSummaryProjection,
} from './projections/order.projection';

export interface IOrderQueryRepository {
  findSummaryForClient(
    orderId: string,
  ): Promise<ClientOrderSummaryProjection | null>;

  // used
  findDeliveredOrdersForCustomer(
    customerId: string,
  ): Promise<ClientOrderPreviewProjection[]>;

  // used
  findOnGoingOrderForClient(
    customerId: string,
  ): Promise<ClientOrderSummaryProjection | null>;

  // used
  findOrderSummariesForOwner(
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
  ): Promise<DriverOrderSummaryProjection | null>;
}
