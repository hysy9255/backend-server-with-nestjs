import { Field, ObjectType } from '@nestjs/graphql';
import { RestaurantQueryProjection } from 'src/restaurant/infrastructure/repositories/query/retaurant-query.repository.interface';

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

  constructor(projection: RestaurantQueryProjection) {
    this.id = projection.id;
    this.name = projection.name;
    this.address = projection.address;
    this.category = projection.category;
  }
}
