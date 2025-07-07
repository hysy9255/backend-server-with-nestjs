import { RestaurantCommandProjection } from 'src/restaurant/infrastructure/repositories/command/restaurant-command.repository.interface';
import { RestaurantEntity } from '../domain/restaurant.entity';
import { RestaurantOrmEntity } from '../infrastructure/orm-entities/restaurant.orm.entity';

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

  static toDomain(projection: RestaurantCommandProjection): RestaurantEntity {
    return RestaurantEntity.fromPersistance(
      projection.id,
      projection.name,
      projection.address,
      projection.category,
      projection.ownerId,
    );
  }
}
