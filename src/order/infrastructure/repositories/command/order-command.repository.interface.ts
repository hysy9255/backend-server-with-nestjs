import { OrderStatus } from 'src/constants/orderStatus';
import { OrderOrmEntity } from 'src/order/infrastructure/orm-entities/order.orm.entity';

export class OrderProjection {
  id: string;
  status: OrderStatus;
  clientId: string;
  driverId?: string | null;
  restaurantId: string;
  rejectedDriverIds: string[];
}

export interface IOrderCommandRepository {
  save(order: OrderOrmEntity): Promise<void>;
  findOneById(id: string): Promise<OrderProjection>;
}
