import { OwnerMapper } from 'src/user/mapper/owner.mapper';
import { RestaurantEntity } from '../domain/restaurant.entity';
import { RestaurantRecord } from '../orm-entities/restaurant.orm.entity';

export class RestaurantMapper {
  static toRecord(restaurantEntity: RestaurantEntity): RestaurantRecord {
    const restaurantRecord = new RestaurantRecord();
    restaurantRecord.id = restaurantEntity.id;
    restaurantRecord.name = restaurantEntity.name;
    restaurantRecord.address = restaurantEntity.address;
    restaurantRecord.category = restaurantEntity.category;
    restaurantRecord.ownerId = restaurantEntity.ownerId;

    return restaurantRecord;
  }

  static toDomain(restaurantRecord: RestaurantRecord): RestaurantEntity {
    return RestaurantEntity.fromPersistance(
      restaurantRecord.id,
      restaurantRecord.name,
      restaurantRecord.address,
      restaurantRecord.category,
      restaurantRecord.ownerId,
      // OwnerMapper.toDomain(restaurantRecord.owner),
    );
  }
}
