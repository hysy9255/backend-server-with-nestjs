import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OrderActionInput {
  @Field(() => String)
  orderId: string;
}
