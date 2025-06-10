import { RestaurantEntity } from '../domain/restaurant.entity';
import { RestaurantOrmEntity } from '../orm-entities/restaurant.orm.entity';

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

  static toDomain(record: RestaurantOrmEntity): RestaurantEntity {
    return RestaurantEntity.fromPersistance(
      record.id,
      record.name,
      record.address,
      record.category,
      record.ownerId,
    );
  }
}
