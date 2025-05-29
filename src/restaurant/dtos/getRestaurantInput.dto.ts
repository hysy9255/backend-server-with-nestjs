import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Restaurant } from '../orm-records/restaurant.record';

@InputType()
export class GetRestaurantInput {
  @Field(() => String)
  id: string;
}
