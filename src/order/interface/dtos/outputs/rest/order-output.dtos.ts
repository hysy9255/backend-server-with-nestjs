import {
  IClientOrderPreviewDTO,
  IClientOrderDTO,
  IDriverOrderDTO,
  IOwnerOrderDTO,
} from '../order-output.dto.interface';
import { OmitType, PickType } from '@nestjs/swagger';
import { RestOrderDTO } from './base-order-output.dto';
import {
  OrderForClient,
  OrderForDriver,
  OrderForOwner,
} from 'src/order/infrastructure/repositories/query/projections/order.projection';

// prettier-ignore
export class RestClientOrderDTO extends OmitType(RestOrderDTO, []) implements IClientOrderDTO {
  constructor(order: OrderForClient) {
    super();
    Object.assign(this, order);
  }
}
// prettier-ignore
export class RestClientOrderPreviewDTO extends PickType(RestOrderDTO, [
    'id',
    'status',
    'restaurantId',
    'restaurantName',
  ]) implements IClientOrderPreviewDTO {
  constructor(order: Partial<OrderForClient>) {
    super();
    Object.assign(this, order);
  }
}
// prettier-ignore
export class RestOwnerOrderDTO extends OmitType(RestOrderDTO, [
  'restaurantName'
]) implements IOwnerOrderDTO {
  constructor(order: OrderForOwner) {
    super();
    Object.assign(this, order);
  }
}
// prettier-ignore
export class RestDriverOrderDTO extends OmitType(RestOrderDTO, []) implements IDriverOrderDTO {
  constructor(order: OrderForDriver) {
    super();
    Object.assign(this, order);
  }
}
