import { OrderMapper } from 'src/order/mapper/order.mapper';
import { DriverEntity } from '../domain/driver.entity';
import { CustomerEntity } from '../domain/customer.entity';
import { CustomerOrmEntity } from '../orm-entities/customer.orm.entity';

export class CustomerMapper {
  static toRecord(customerEntity: CustomerEntity): CustomerOrmEntity {
    const customerRecord = new CustomerOrmEntity();
    customerRecord.id = customerEntity.id;
    customerRecord.userId = customerEntity.userId;
    customerRecord.deliveryAddress = customerEntity.deliveryAddress;
    // if (customerEntity.orders) {
    //   customerRecord.orders = customerEntity.orders?.map((order) =>
    //     OrderMapper.toRecord(order),
    //   );
    // }

    return customerRecord;
  }

  static toDomain(customerRecord: CustomerOrmEntity): CustomerEntity {
    return CustomerEntity.fromPersistance(
      customerRecord.id,
      customerRecord.userId,
      customerRecord.deliveryAddress,
      // customerRecord.orders.map((order) => OrderMapper.toDomain(order)),
    );
  }
}
