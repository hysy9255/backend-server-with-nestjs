import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetOrderInput {
  @Field(() => String)
  orderId: string;
}
