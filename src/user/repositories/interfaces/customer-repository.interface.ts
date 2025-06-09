import { CustomerOrmEntity } from 'src/user/orm-entities/customer.orm.entity';

export interface CustomerRepository {
  save(customerRecord: CustomerOrmEntity);
  findByUserId(userId: string): Promise<CustomerOrmEntity | null>;
  findById(id: string): Promise<CustomerOrmEntity | null>;
}
