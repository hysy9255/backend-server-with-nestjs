import { OrderStatus } from 'src/constants/orderStatus';

export class OrderSummaryForClient {
  id: string;
  status: OrderStatus;
  deliveryAddress: string;
  customerId: string;
  driverId?: string | null;
  restaurantId: string;
  restaurantName: string;
}
