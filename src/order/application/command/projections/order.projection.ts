import { OrderStatus } from 'src/constants/orderStatus';

export class OrderProjection {
  id: string;
  status: OrderStatus;
  customerId: string;
  driverId?: string | null;
  restaurantId: string;
  rejectedDriverIds: string[];
}
