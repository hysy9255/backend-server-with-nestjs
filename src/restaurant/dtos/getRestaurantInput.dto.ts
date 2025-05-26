import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Restaurant } from '../domain/restaurant.entity';

@InputType()
export class GetRestaurantInput {
  @Field(() => String)
  id: string;
}
