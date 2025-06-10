import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetOrderByDriverInput {
  @Field(() => String)
  orderId: string;
}
