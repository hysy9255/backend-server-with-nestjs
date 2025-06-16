import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';
import {
  ClientOrderPreviewProjection,
  ClientOrderSummaryProjection,
  DriverOrderSummaryProjection,
  OwnerOrderSummaryProjection,
} from 'src/order/infrastructure/repositories/query/projections/order.projection';

@ObjectType()
export class BaseOrderDTO {
  @Field(() => String)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => String)
  deliveryAddress: string;

  @Field(() => String)
  customerId: string;

  @Field(() => String, { nullable: true })
  driverId?: string | null;

  @Field(() => String)
  restaurantId: string;

  @Field(() => String)
  restaurantName: string;
}

// used
@ObjectType()
export class ClientOrderSummaryDTO extends PickType(BaseOrderDTO, [
  'id',
  'status',
  'deliveryAddress',
  'customerId',
  'driverId',
  'restaurantId',
  'restaurantName',
]) {
  constructor(projection: ClientOrderSummaryProjection) {
    super();
    this.id = projection.id;
    this.status = projection.status;
    this.deliveryAddress = projection.deliveryAddress;
    this.customerId = projection.customerId;
    this.driverId = projection.driverId ?? projection.driverId;
    this.restaurantId = projection.restaurantId;
    this.restaurantName = projection.restaurantName;
  }
}

// used
@ObjectType()
export class ClientOrderPreviewDTO extends PickType(BaseOrderDTO, [
  'id',
  'status',
  'restaurantId',
  'restaurantName',
]) {
  constructor(projection: ClientOrderPreviewProjection) {
    super();
    this.id = projection.id;
    this.status = projection.status;
    this.restaurantId = projection.restaurantId;
    this.restaurantName = projection.restaurantName;
  }
}

// used
@ObjectType()
export class OwnerOrderSummaryDTO extends PickType(BaseOrderDTO, [
  'id',
  'status',
  'deliveryAddress',
  'customerId',
  'driverId',
  'restaurantId',
]) {
  constructor(projection: OwnerOrderSummaryProjection) {
    super();
    this.id = projection.id;
    this.status = projection.status;
    this.deliveryAddress = projection.deliveryAddress;
    this.customerId = projection.customerId;
    this.driverId = projection.driverId ?? projection.driverId;
    this.restaurantId = projection.restaurantId;
  }
}

// used
@ObjectType()
export class DriverOrderSummaryDTO extends PickType(BaseOrderDTO, [
  'id',
  'status',
  'deliveryAddress',
  'customerId',
  'restaurantId',
  'restaurantName',
  'driverId',
]) {
  constructor(projection: DriverOrderSummaryProjection) {
    super();
    this.id = projection.id;
    this.status = projection.status;
    this.deliveryAddress = projection.deliveryAddress;
    this.customerId = projection.customerId;
    this.restaurantId = projection.restaurantId;
    this.restaurantName = projection.restaurantName;
    this.driverId = projection.driverId ?? projection.driverId;
  }
}
