import { OrderOrmEntity } from 'src/order/infrastructure/orm-entities/order.orm.entity';
import { OrderRecord } from './order-command.repository';

export interface IOrderCommandRepository {
  save(order: OrderOrmEntity): Promise<void>;
  findOneById(id: string): Promise<OrderRecord>;
}
