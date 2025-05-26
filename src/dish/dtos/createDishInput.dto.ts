import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDishInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  price: string;
}
