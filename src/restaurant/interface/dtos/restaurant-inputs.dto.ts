import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class GetRestaurantInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  id: string;
}

@InputType()
export class CreateRestaurantInput {
  @ApiProperty({ example: 'Chinese Tuxedo', description: 'Restaurant Name' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '5 Doyers St, New York, NY 10013, United States',
    description: 'Restaurant Address',
  })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Asian Cuisine', description: 'Restaurant Category' })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  category: string;
}
