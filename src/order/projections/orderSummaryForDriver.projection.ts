import { OrderStatus } from 'src/constants/orderStatus';

export class DriverOrderSummaryProjection {
  id: string;
  status: OrderStatus;
  deliveryAddress: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  driverId?: string | null;
}
