import { Field, ObjectType } from '@nestjs/graphql';
import { RestaurantEntity } from '../domain/restaurant.entity';
import { RestaurantSummaryProjection } from '../projections/restaurantSummary.projection';

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

  constructor(projection: RestaurantSummaryProjection) {
    this.id = projection.id;
    this.name = projection.name;
    this.address = projection.address;
    this.category = projection.category;
  }
}
