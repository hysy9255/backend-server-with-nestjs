import { OrderStatus } from 'src/constants/orderStatus';

export class ClientOrderSummary {
  id: string;
  status: OrderStatus;
  deliveryAddress: string;
  customerId: string;
  driverId?: string | null;
  restaurantId: string;
}
