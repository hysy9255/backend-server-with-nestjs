import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';

@InputType()
export class ClientGetOrderInput {
  @Field(() => String)
  orderId: string;
}
