import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AcceptOrderInput {
  @Field(() => String)
  orderId: string;
}
