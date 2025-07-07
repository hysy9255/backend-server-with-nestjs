import { Field, ObjectType } from '@nestjs/graphql';
import { IOrderDTO } from '../order-output.dto.interface';
import { OrderStatus } from 'src/constants/orderStatus';

@ObjectType()
export class GqlOrderDTO implements IOrderDTO {
  @Field(() => String)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => String)
  deliveryAddress: string;

  @Field(() => String)
  clientId: string;

  @Field(() => String, { nullable: true })
  driverId: string | null;

  @Field(() => String)
  restaurantId: string;

  @Field(() => String)
  restaurantName: string;
}
