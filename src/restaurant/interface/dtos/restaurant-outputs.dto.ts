import { Field, ObjectType } from '@nestjs/graphql';
import { RestaurantSummaryProjection } from 'src/restaurant/application/query/projections/restaurant.projection';

@ObjectType()
export class RestaurantSummaryDTO {
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
