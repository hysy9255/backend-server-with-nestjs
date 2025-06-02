import { Field, ObjectType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';
import { OrderEntity } from '../domain/order.entity';
import { RestaurantEntity } from 'src/restaurant/domain/restaurant.entity';

@ObjectType()
class RestaurantDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  category: string;

  constructor(restaurantEntity: RestaurantEntity) {
    this.id = restaurantEntity.id;
    this.name = restaurantEntity.name;
    this.address = restaurantEntity.address;
    this.category = restaurantEntity.category;
  }
}

@ObjectType()
export class OrderDTO {
  @Field(() => String)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => RestaurantDTO)
  restaurant: RestaurantDTO;

  constructor(orderEntity: OrderEntity) {
    this.id = orderEntity.id;
    this.status = orderEntity.status;
    this.restaurant = new RestaurantDTO(orderEntity.restaurant);
  }
}
