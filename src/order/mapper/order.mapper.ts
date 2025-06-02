import { RestaurantMapper } from 'src/restaurant/mapper/restaurant.mapper';
import { OrderEntity } from '../domain/order.entity';
import { OrderRecord } from '../orm-records/order.record';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { CustomerMapper } from 'src/user/mapper/customer.mapper';
import { DriverMapper } from 'src/user/mapper/driver.mapper';

export class OrderMapper {
  static toRecord(orderEntity: OrderEntity): OrderRecord {
    const orderRecord = new OrderRecord();
    orderRecord.id = orderEntity.id;
    orderRecord.status = orderEntity.status;
    orderRecord.restaurant = RestaurantMapper.toRecord(orderEntity.restaurant);
    orderRecord.customer = CustomerMapper.toRecord(orderEntity.customer);
    orderRecord.driver = orderEntity.driver
      ? DriverMapper.toRecord(orderEntity.driver)
      : null;
    orderRecord.rejectedDrivers = orderEntity.rejectedDrivers.map((driver) =>
      DriverMapper.toRecord(driver),
    );

    return orderRecord;
  }

  static toDomain(orderRecord: OrderRecord): OrderEntity {
    return OrderEntity.fromPersistance(
      orderRecord.id,
      orderRecord.status,
      RestaurantMapper.toDomain(orderRecord.restaurant),
      CustomerMapper.toDomain(orderRecord.customer),
      orderRecord.driver
        ? DriverMapper.toDomain(orderRecord.driver)
        : undefined,
      orderRecord.rejectedDrivers.map((driver) =>
        DriverMapper.toDomain(driver),
      ),
    );
  }
}
