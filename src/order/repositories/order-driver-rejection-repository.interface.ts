import { OrderDriverRejectionOrmEntity } from '../orm-entities/order-driver-rejection.orm';

export interface OrderDriverRejectionRepository {
  // orm based operations
  // used
  save(orderDriverRejection: OrderDriverRejectionOrmEntity): Promise<void>;
}
