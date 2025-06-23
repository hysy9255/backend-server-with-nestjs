import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class GetRestaurantInput {
  @Field(() => String)
  id: string;
}

@InputType()
export class CreateRestaurantInput {
  @ApiProperty({ example: 'Chinese Tuxedo', description: 'Restaurant Name' })
  @Field(() => String)
  name: string;

  @ApiProperty({
    example: '5 Doyers St, New York, NY 10013, United States',
    description: 'Restaurant Address',
  })
  @Field(() => String)
  address: string;

  @ApiProperty({ example: 'Asian Cuisine', description: 'Restaurant Category' })
  @Field(() => String)
  category: string;
}
