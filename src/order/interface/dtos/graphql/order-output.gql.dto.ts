import { Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import {
  IBaseOrderDTO,
  IClientOrderPreviewDTO,
  IClientOrderSummaryDTO,
  IDriverOrderSummaryDTO,
  IOwnerOrderSummaryDTO,
} from '../order-output.dto.interface';
import { OrderStatus } from 'src/constants/orderStatus';
import {
  ClientOrderPreviewProjection,
  ClientOrderSummaryProjection,
  DriverOrderSummaryProjection,
  OwnerOrderSummaryProjection,
} from 'src/order/infrastructure/repositories/query/projections/order.projection';

@ObjectType()
export class GqlBaseOrderDTO implements IBaseOrderDTO {
  @Field(() => String)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => String)
  deliveryAddress: string;

  @Field(() => String)
  customerId: string;

  @Field(() => String, { nullable: true })
  driverId: string | null;

  @Field(() => String)
  restaurantId: string;

  @Field(() => String)
  restaurantName: string;
}

@ObjectType()
export class GqlClientOrderSummaryDTO
  extends OmitType(GqlBaseOrderDTO, [])
  implements IClientOrderSummaryDTO
{
  constructor(projection: ClientOrderSummaryProjection) {
    super();
    Object.assign(this, projection);
  }
}

@ObjectType()
export class GqlClientOrderPreviewDTO
  extends PickType(GqlBaseOrderDTO, [
    'id',
    'status',
    'restaurantId',
    'restaurantName',
  ])
  implements IClientOrderPreviewDTO
{
  constructor(projection: ClientOrderPreviewProjection) {
    super();
    Object.assign(this, projection);
  }
}

@ObjectType()
export class GqlOwnerOrderSummaryDTO
  extends OmitType(GqlBaseOrderDTO, ['restaurantName'])
  implements IOwnerOrderSummaryDTO
{
  constructor(projection: OwnerOrderSummaryProjection) {
    super();
    Object.assign(this, projection);
  }
}

@ObjectType()
export class GqlDriverOrderSummaryDTO
  extends OmitType(GqlBaseOrderDTO, [])
  implements IDriverOrderSummaryDTO
{
  constructor(projection: DriverOrderSummaryProjection) {
    super();
    Object.assign(this, projection);
  }
}
