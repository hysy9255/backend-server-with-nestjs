import { CustomerOrmEntity } from 'src/user/infrastructure/orm-entities/customer.orm.entity';

export class CustomerCmdProjection {
  id: string;
  userId: string;
  deliveryAddress: string;
}

export interface ICustomerCommandRepository {
  save(customerRecord: CustomerOrmEntity);
  findByUserId(userId: string): Promise<CustomerCmdProjection | null>;
}
