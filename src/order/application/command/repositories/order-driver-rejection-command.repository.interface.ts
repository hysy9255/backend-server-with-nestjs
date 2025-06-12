import { OrderDriverRejectionOrmEntity } from 'src/order/infrastructure/orm-entities/order-driver-rejection.orm';

export interface IOrderDriverRejectionCommandRepository {
  // orm based operations
  // used
  save(orderDriverRejection: OrderDriverRejectionOrmEntity): Promise<void>;
}
