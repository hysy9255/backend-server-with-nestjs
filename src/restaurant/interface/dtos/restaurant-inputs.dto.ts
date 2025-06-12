import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetRestaurantInput {
  @Field(() => String)
  id: string;
}

@InputType()
export class CreateRestaurantInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  category: string;
}
