import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Restaurant } from '../domain/restaurant.entity';

@InputType()
export class GetRestaurantsInput {
  @Field(() => String)
  category: string;
}
