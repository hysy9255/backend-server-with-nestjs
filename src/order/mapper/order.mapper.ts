import { OrderEntity } from '../domain/order.entity';
import { OrderOrmEntity } from '../orm-entities/order.orm.entity';
import { OrderProjectionForEntity } from '../projections/order.projection';

export class OrderMapper {
  static toOrmEntity(entity: OrderEntity): OrderOrmEntity {
    const record = new OrderOrmEntity();
    record.id = entity.id;
    record.status = entity.status;
    record.restaurantId = entity.restaurantId;
    record.customerId = entity.customerId;
    record.driverId = entity.driverId;

    return record;
  }

  static toDomain(projection: OrderProjectionForEntity): OrderEntity {
    return OrderEntity.fromPersistance(
      projection.id,
      projection.status,
      projection.restaurantId,
      projection.customerId,
      projection.driverId ? projection.driverId : undefined,
      projection.rejectedDriverIds,
    );
  }

  static toDomainTemporary(record: OrderOrmEntity): OrderEntity {
    return OrderEntity.fromPersistance(
      record.id,
      record.status,
      record.restaurantId,
      record.customerId,
      record.driverId ? record.driverId : undefined,
    );
  }
}
