import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Restaurant } from '../orm-records/restaurant.record';

@InputType()
export class GetRestaurantsInput {
  @Field(() => String)
  category: string;
}
