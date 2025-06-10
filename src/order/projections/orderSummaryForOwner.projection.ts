import { OrderStatus } from 'src/constants/orderStatus';

// used
export class OwnerOrderSummaryProjection {
  id: string;
  status: OrderStatus;
  deliveryAddress: string;
  customerId: string;
  driverId?: string | null;
  restaurantId: string;
}
