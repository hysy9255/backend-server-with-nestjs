import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';
import { Order } from '../domain/order.entity';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  restaurantId: string;
}

@ObjectType()
export class CreateOrderOutput {
  @Field(() => String)
  id: string;
}

// @ObjectType()
// export class CreateOrderOutput {
//   @Field(() => String)
//   id: string;

//   @Field(() => OrderStatus)
//   status: OrderStatus;

//   @Field(() => String)
//   driverId: string | null;

//   @Field(() => String)
//   restaurantId: string;

//   @Field(() => String)
//   customerId: string;

//   @Field(() => Boolean)
//   driverAssigned?: boolean;

//   constructor(order: Order) {
//     this.id = order.id;
//     this.status = order.status;
//     this.driverId = order.driverId;
//     this.restaurantId = order.restaurant.id;
//     this.customerId = order.customer.id;
//     this.driverAssigned = !!order.driver;
//   }
// }
