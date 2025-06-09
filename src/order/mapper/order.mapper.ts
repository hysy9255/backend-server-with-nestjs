import { OrderEntity } from '../domain/order.entity';
import { OrderOrmEntity } from '../orm-entities/order.orm.entity';

export class OrderMapper {
  static toRecord(orderEntity: OrderEntity): OrderOrmEntity {
    const orderOrmEntity = new OrderOrmEntity();
    orderOrmEntity.id = orderEntity.id;
    orderOrmEntity.status = orderEntity.status;
    orderOrmEntity.restaurantId = orderEntity.restaurantId;
    orderOrmEntity.customerId = orderEntity.customerId;
    orderOrmEntity.driverId = orderEntity.driverId;

    return orderOrmEntity;
  }

  static toDomain(orderOrmEntity: OrderOrmEntity): OrderEntity {
    return OrderEntity.fromPersistance(
      orderOrmEntity.id,
      orderOrmEntity.status,
      orderOrmEntity.restaurantId,
      orderOrmEntity.customerId,
      orderOrmEntity.driverId ?? orderOrmEntity.driverId,
    );
  }
}
