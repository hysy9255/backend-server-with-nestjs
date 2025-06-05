import { OwnerMapper } from 'src/user/mapper/owner.mapper';
import { RestaurantEntity } from '../domain/restaurant.entity';
import { RestaurantRecord } from '../orm-records/restaurant.record';

export class RestaurantMapper {
  static toRecord(restaurantEntity: RestaurantEntity): RestaurantRecord {
    const restaurantRecord = new RestaurantRecord();
    restaurantRecord.id = restaurantEntity.id;
    restaurantRecord.name = restaurantEntity.name;
    restaurantRecord.address = restaurantEntity.address;
    restaurantRecord.category = restaurantEntity.category;
    restaurantRecord.ownerId = restaurantEntity.ownerId;
    // restaurantRecord.owner = res
    // orderEntity.restaurant = RestaurantMapper.toEntity(orderModel.restaurant);
    // orderEntity.customer = CustomerMapper.toEntity(orderModel.customer);

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
