import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RejectOrderInput {
  @Field(() => String)
  orderId: string;
}
