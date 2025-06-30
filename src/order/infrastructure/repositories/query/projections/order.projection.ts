import { OrderStatus } from 'src/constants/orderStatus';

type BaseOrderProjection = {
  id: string;
  status: OrderStatus;
  deliveryAddress: string;
  customerId: string;
  driverId: string | null;
  ownerId: string;
  restaurantId: string;
  restaurantName: string;
};

export type ClientOrderSummaryProjection = Required<BaseOrderProjection>;

export type OwnerOrderSummaryProjection = Omit<
  BaseOrderProjection,
  'restaurantName'
>;

export type DriverOrderSummaryProjection = Required<BaseOrderProjection>;

export type ClientOrderPreviewProjection = Required<BaseOrderProjection>;
