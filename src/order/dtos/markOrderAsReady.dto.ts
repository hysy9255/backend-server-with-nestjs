import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MarkOrderAsReadyInput {
  @Field(() => String)
  orderId: string;
}
