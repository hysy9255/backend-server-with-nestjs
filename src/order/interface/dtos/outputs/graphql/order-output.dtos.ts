import { ObjectType, OmitType, PickType } from '@nestjs/graphql';
import {
  IClientOrderPreviewDTO,
  IClientOrderDTO,
  IDriverOrderDTO,
  IOwnerOrderDTO,
} from '../order-output.dto.interface';
import { GqlOrderDTO } from './base-order-output.dto';
import {
  OrderForClient,
  OrderForDriver,
  OrderForOwner,
} from 'src/order/infrastructure/repositories/query/projections/order.projection';

// prettier-ignore
@ObjectType()
export class GqlClientOrderDTO extends OmitType(GqlOrderDTO, []) implements IClientOrderDTO {
  constructor(order: OrderForClient) {
    super();
    Object.assign(this, order);
  }
}
// prettier-ignore
@ObjectType()
export class GqlClientOrderPreviewDTO extends PickType(GqlOrderDTO, [
  'id', 
  'status', 
  'restaurantId', 
  'restaurantName' 
]) implements IClientOrderPreviewDTO {
  constructor(order: Partial<OrderForClient>) {
    super();
    Object.assign(this, order);
  }
}
// prettier-ignore
@ObjectType()
export class GqlOwnerOrderDTO extends OmitType(GqlOrderDTO, ['restaurantName']) implements IOwnerOrderDTO {
  constructor(order: OrderForOwner) {
    super();
    Object.assign(this, order);
  }
}
// prettier-ignore
@ObjectType()
export class GqlDriverOrderDTO extends OmitType(GqlOrderDTO, []) implements IDriverOrderDTO {
  constructor(order: OrderForDriver) {
    super();
    Object.assign(this, order);
  }
}
