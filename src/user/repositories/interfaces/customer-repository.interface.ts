import { CustomerRecord } from '../../orm-records/customer.record';

export interface CustomerRepository {
  save(customerRecord: CustomerRecord);
  findByUserId(userId: string): Promise<CustomerRecord | null>;
  findById(id: string): Promise<CustomerRecord | null>;
}
