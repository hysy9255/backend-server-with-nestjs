import { RestaurantProjection } from '../../command/projections/restaurant.projection';
import { RestaurantEntity } from '../../../domain/restaurant.entity';
import { RestaurantOrmEntity } from '../../../infrastructure/orm-entities/restaurant.orm.entity';

export class RestaurantMapper {
  static toOrmEntity(entity: RestaurantEntity): RestaurantOrmEntity {
    const record = new RestaurantOrmEntity();
    record.id = entity.id;
    record.name = entity.name;
    record.address = entity.address;
    record.category = entity.category;
    record.ownerId = entity.ownerId;

    return record;
  }

  static toDomain(projection: RestaurantProjection): RestaurantEntity {
    return RestaurantEntity.fromPersistance(
      projection.id,
      projection.name,
      projection.address,
      projection.category,
      projection.ownerId,
    );
  }
}
