import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class GetRestaurantsInput {
  @Field(() => String)
  category: string;
}
