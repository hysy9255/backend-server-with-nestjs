import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OrderActionInput {
  @Field(() => String)
  orderId: string;
}

@InputType()
export class GetOrderInput {
  @Field(() => String)
  orderId: string;
}

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  restaurantId: string;
}
