import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class GetRestaurantInput {
  @Field(() => String)
  id: string;
}
