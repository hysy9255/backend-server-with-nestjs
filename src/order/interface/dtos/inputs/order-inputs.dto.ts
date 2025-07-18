import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class OrderActionInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  id: string;
}

@InputType()
export class GetOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  orderId: string;
}

@InputType()
export class CreateOrderInput {
  @ApiProperty({ example: 'uuid', description: 'RestaurantId' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  restaurantId: string;
}
