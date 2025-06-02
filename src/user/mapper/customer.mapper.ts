import { OrderMapper } from 'src/order/mapper/order.mapper';
import { DriverEntity } from '../domain/driver.entity';
import { DriverRecord } from '../orm-records/driver.record';
import { CustomerEntity } from '../domain/customer.entity';
import { CustomerRecord } from '../orm-records/customer.record';

export class CustomerMapper {
  static toRecord(customerEntity: CustomerEntity): CustomerRecord {
    const customerRecord = new CustomerRecord();
    customerRecord.id = customerEntity.id;
    customerRecord.deliveryAddress = customerEntity.deliveryAddress;
    if (customerEntity.orders) {
      customerRecord.orders = customerEntity.orders?.map((order) =>
        OrderMapper.toRecord(order),
      );
    }

    return customerRecord;
  }

  static toDomain(customerRecord: CustomerRecord): CustomerEntity {
    return CustomerEntity.fromPersistance(
      customerRecord.id,
      customerRecord.deliveryAddress,
      customerRecord.orders,
    );
  }
}
