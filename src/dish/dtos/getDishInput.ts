import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetDishInput {
  @Field(() => String)
  id: string;
}
