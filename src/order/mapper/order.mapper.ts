import { RestaurantMapper } from 'src/restaurant/mapper/restaurant.mapper';
import { OrderEntity } from '../domain/order.entity';
import { OrderRecord } from '../orm-records/order.record';
import { UserMapper } from 'src/user/mapper/user.mapper';

export class OrderMapper {
  static toRecord(orderEntity: OrderEntity): OrderRecord {
    const orderRecord = new OrderRecord();
    orderRecord.id = orderEntity.id;
    orderRecord.status = orderEntity.status;
    orderRecord.restaurant = RestaurantMapper.toRecord(orderEntity.restaurant);
    orderRecord.customer = UserMapper.toRecord(orderEntity.customer);
    orderRecord.driver = orderEntity.driver
      ? UserMapper.toRecord(orderEntity.driver)
      : null;
    orderRecord.rejectedDrivers = orderEntity.rejectedDrivers.map((driver) =>
      UserMapper.toRecord(driver),
    );

    return orderRecord;
  }

  static toDomain(orderRecord: OrderRecord): OrderEntity {
    return OrderEntity.fromPersistance(
      orderRecord.id,
      orderRecord.status,
      RestaurantMapper.toDomain(orderRecord.restaurant),
      UserMapper.toDomain(orderRecord.customer),
      orderRecord.driver ? UserMapper.toDomain(orderRecord.driver) : undefined,
      orderRecord.rejectedDrivers.map((driver) => UserMapper.toDomain(driver)),
    );
  }
}
