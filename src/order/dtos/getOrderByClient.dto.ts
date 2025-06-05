import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';

@InputType()
export class GetOrderByClientInput {
  @Field(() => String)
  orderId: string;
}
