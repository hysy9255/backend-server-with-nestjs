import { OrderOrmEntity } from 'src/order/infrastructure/orm-entities/order.orm.entity';
import { OrderProjection } from '../projections/order.projection';

export interface IOrderCommandRepository {
  save(order: OrderOrmEntity): Promise<void>;
  findOneById(id: string): Promise<OrderProjection | null>;
}
