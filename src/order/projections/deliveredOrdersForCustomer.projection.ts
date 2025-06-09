import { OrderStatus } from 'src/constants/orderStatus';

export class DeliveredOrderPreview {
  id: string;
  status: OrderStatus;
  restaurantId: string;
}
