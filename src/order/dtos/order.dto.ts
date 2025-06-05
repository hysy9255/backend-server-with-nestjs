import { Field, ObjectType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';
import { OrderEntity } from '../domain/order.entity';
import { RestaurantEntity } from 'src/restaurant/domain/restaurant.entity';
import { CustomerEntity } from 'src/user/domain/customer.entity';

@ObjectType()
export class OrderDTO {
  @Field(() => String)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => String)
  restaurantId: string;

  // @Field(() => RestaurantDTO)
  // restaurant: RestaurantDTO;

  constructor(orderEntity: OrderEntity) {
    this.id = orderEntity.id;
    this.status = orderEntity.status;
    this.restaurantId = orderEntity.restaurantId;
    // this.restaurant = new RestaurantDTO(orderEntity.restaurant);
  }
}

@ObjectType()
export class OrderDTOForOwner extends OrderDTO {
  @Field(() => String)
  customerId: string;

  @Field(() => String)
  deliveryAddress: string;

  constructor(orderEntity: OrderEntity, customerEntity: CustomerEntity) {
    super(orderEntity);
    this.customerId = customerEntity.id;
    this.deliveryAddress = customerEntity.deliveryAddress;
  }
}

@ObjectType()
export class OrderDTOForDriver extends OrderDTO {
  @Field(() => String)
  customerId: string;

  @Field(() => String)
  deliveryAddress: string;

  constructor(orderEntity: OrderEntity, customerEntity: CustomerEntity) {
    super(orderEntity);
    this.customerId = customerEntity.id;
    this.deliveryAddress = customerEntity.deliveryAddress;
  }
}
