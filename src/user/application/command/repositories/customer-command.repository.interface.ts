import { CustomerOrmEntity } from 'src/user/infrastructure/orm-entities/customer.orm.entity';
import { CustomerProjection } from '../projections/customer.projection';

export interface ICustomerCommandRepository {
  save(customerRecord: CustomerOrmEntity);
  findByUserId(userId: string): Promise<CustomerProjection | null>;
  // findById(id: string): Promise<CustomerOrmEntity | null>;
}
