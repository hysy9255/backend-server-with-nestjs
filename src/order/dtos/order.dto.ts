import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';
import { OwnerOrderSummaryProjection } from '../projections/orderSummaryForOwner.projection';
import { DriverOrderSummaryProjection } from '../projections/orderSummaryForDriver.projection';
import { OrderSummaryForClient } from '../projections/orderSummaryForClient.projection';
import { OrderPreviewForClient } from '../projections/deliveredOrdersForCustomer.projection';

@ObjectType()
export class OrderDTO {
  @Field(() => String)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;
}

// used
@ObjectType()
export class OrderSummaryDTOForClient extends PickType(OrderDTO, [
  'id',
  'status',
]) {
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

  constructor(projection: OrderSummaryForClient) {
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
export class OrderPreviewDTOForClient extends PickType(OrderDTO, [
  'id',
  'status',
]) {
  @Field(() => String)
  restaurantId: string;

  @Field(() => String)
  restaurantName: string;

  constructor(projection: OrderPreviewForClient) {
    super();
    this.id = projection.id;
    this.status = projection.status;
    this.restaurantId = projection.restaurantId;
    this.restaurantName = projection.restaurantName;
  }
}

// used
@ObjectType()
export class OrderSummaryDTOForOwner extends PickType(OrderDTO, [
  'id',
  'status',
]) {
  @Field(() => String)
  deliveryAddress: string;

  @Field(() => String)
  customerId: string;

  @Field(() => String, { nullable: true })
  driverId?: string | null;

  constructor(projection: OwnerOrderSummaryProjection) {
    super();
    this.id = projection.id;
    this.status = projection.status;
    this.deliveryAddress = projection.deliveryAddress;
    this.customerId = projection.customerId;
    this.driverId = projection.driverId ?? projection.driverId;
  }
}

// used
@ObjectType()
export class OrderSummaryDTOForDriver extends PickType(OrderDTO, [
  'id',
  'status',
]) {
  @Field(() => String)
  deliveryAddress: string;

  @Field(() => String)
  customerId: string;

  @Field(() => String)
  restaurantId: string;

  @Field(() => String)
  restaurantName: string;

  constructor(projection: DriverOrderSummaryProjection) {
    super();
    this.id = projection.id;
    this.status = projection.status;
    this.deliveryAddress = projection.deliveryAddress;
    this.customerId = projection.customerId;
    this.restaurantId = projection.restaurantId;
    this.restaurantName = projection.restaurantName;
  }
}

// // used
// @ObjectType()
// export class OrderSummaryDTOForClient {
//   @Field(() => String)
//   id: string;

//   @Field(() => OrderStatus)
//   status: OrderStatus;

//   @Field(() => String)
//   deliveryAddress: string;

//   @Field(() => String)
//   customerId: string;

//   @Field(() => String, { nullable: true })
//   driverId?: string | null;

//   @Field(() => String)
//   restaurantId: string;

//   @Field(() => String)
//   restaurantName: string;

//   constructor(projection: ClientOrderSummaryProjection) {
//     this.id = projection.id;
//     this.status = projection.status;
//     this.deliveryAddress = projection.deliveryAddress;
//     this.customerId = projection.customerId;
//     this.driverId = projection.driverId ?? projection.driverId;
//     this.restaurantId = projection.restaurantId;
//     this.restaurantName = projection.restaurantName;
//   }
// }

// @ObjectType()
// export class OrderDTOForOwner extends OrderDTO {
//   @Field(() => String)
//   customerId: string;

//   @Field(() => String)
//   deliveryAddress: string;

//   constructor(orderEntity: OrderEntity, customerEntity: CustomerEntity) {
//     super(orderEntity);
//     this.customerId = customerEntity.id;
//     this.deliveryAddress = customerEntity.deliveryAddress;
//   }
// }

// @ObjectType()
// export class OrderDTOForDriver extends OrderDTO {
//   @Field(() => String)
//   customerId: string;

//   @Field(() => String)
//   deliveryAddress: string;

//   constructor(orderEntity: OrderEntity, customerEntity: CustomerEntity) {
//     super(orderEntity);
//     this.customerId = customerEntity.id;
//     this.deliveryAddress = customerEntity.deliveryAddress;
//   }
// }
