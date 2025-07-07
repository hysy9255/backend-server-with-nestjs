import { OrderEntity } from '../domain/order.entity';
import { OrderOrmEntity } from '../infrastructure/orm-entities/order.orm.entity';
import { OrderRecord } from '../infrastructure/repositories/command/order-command.repository';

export class OrderMapper {
  static toOrmEntity(entity: OrderEntity): OrderOrmEntity {
    const record = new OrderOrmEntity();
    record.id = entity.id;
    record.status = entity.status;
    record.restaurantId = entity.restaurantId;
    record.clientId = entity.clientId;
    record.driverId = entity.driverId;

    return record;
  }

  static toDomain(record: OrderRecord): OrderEntity {
    return OrderEntity.fromPersistance(
      record.id,
      record.status,
      record.restaurantId,
      record.clientId,
      record.driverId ? record.driverId : null,
      record.rejectedDriverIds ? record.rejectedDriverIds : [],
    );
  }
}
