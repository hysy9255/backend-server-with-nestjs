import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';

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
export class OrderSummaryDTOForClient extends PickType(BaseOrderDTO, [
  'id',
  'status',
  'deliveryAddress',
  'customerId',
  'driverId',
  'restaurantId',
  'restaurantName',
]) {
  constructor(projection: OrderSummaryDTOForClient) {
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
export class OrderPreviewDTOForClient extends PickType(BaseOrderDTO, [
  'id',
  'status',
  'restaurantId',
  'restaurantName',
]) {
  constructor(projection: OrderPreviewDTOForClient) {
    super();
    this.id = projection.id;
    this.status = projection.status;
    this.restaurantId = projection.restaurantId;
    this.restaurantName = projection.restaurantName;
  }
}

// used
@ObjectType()
export class OrderSummaryDTOForOwner extends PickType(BaseOrderDTO, [
  'id',
  'status',
  'deliveryAddress',
  'customerId',
  'driverId',
  'restaurantId',
]) {
  constructor(projection: OrderSummaryDTOForOwner) {
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
export class OrderSummaryDTOForDriver extends PickType(BaseOrderDTO, [
  'id',
  'status',
  'deliveryAddress',
  'customerId',
  'restaurantId',
  'restaurantName',
  'driverId',
]) {
  constructor(projection: OrderSummaryDTOForDriver) {
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
