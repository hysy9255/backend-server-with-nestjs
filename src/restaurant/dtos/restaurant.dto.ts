import { Field, ObjectType } from '@nestjs/graphql';
import { RestaurantEntity } from '../domain/restaurant.entity';

@ObjectType()
export class RestaurantDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  category: string;

  constructor(restaurantEntity: RestaurantEntity) {
    this.id = restaurantEntity.id;
    this.name = restaurantEntity.name;
    this.address = restaurantEntity.address;
    this.category = restaurantEntity.category;
  }
}
