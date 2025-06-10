import { OrderStatus } from 'src/constants/orderStatus';

export class OrderPreviewForClient {
  id: string;
  status: OrderStatus;
  restaurantId: string;
  restaurantName: string;
}
