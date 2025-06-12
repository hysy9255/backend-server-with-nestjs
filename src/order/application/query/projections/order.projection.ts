import { OrderStatus } from 'src/constants/orderStatus';

export class BaseOrderProjection {
  id: string;
  status: OrderStatus;
  deliveryAddress: string;
  customerId: string;
  driverId?: string | null;
}

export class ClientOrderSummaryProjection extends BaseOrderProjection {
  restaurantId: string;
  restaurantName: string;
}

export class OwnerOrderSummaryProjection extends BaseOrderProjection {
  restaurantId: string; // name 없음
}

export class DriverOrderSummaryProjection extends BaseOrderProjection {
  restaurantId: string;
  restaurantName: string;
}

export class ClientOrderPreviewProjection extends BaseOrderProjection {
  restaurantId: string;
  restaurantName: string;
}
