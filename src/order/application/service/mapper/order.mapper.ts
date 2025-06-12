import { OrderProjection } from '../../../infrastructure/repositories/command/order-command.repository';
import { OrderEntity } from '../../../domain/order.entity';
import { OrderOrmEntity } from '../../../infrastructure/orm-entities/order.orm.entity';

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

  static toDomain(projection: OrderProjection): OrderEntity {
    return OrderEntity.fromPersistance(
      projection.id,
      projection.status,
      projection.restaurantId,
      projection.customerId,
      projection.driverId ? projection.driverId : undefined,
      projection.rejectedDriverIds,
    );
  }
}
