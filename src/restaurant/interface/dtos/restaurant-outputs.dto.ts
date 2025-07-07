import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from 'src/restaurant/infrastructure/repositories/query/projections/restaurant.projection';

@ObjectType()
export class RestaurantSummaryDTO {
  @ApiProperty({ example: 'uuid', description: 'restaurantId' })
  @Field(() => String)
  id: string;

  @ApiProperty({ example: 'Chinese Tuxedo', description: 'Restaurant Name' })
  @Field(() => String)
  name: string;

  @ApiProperty({
    example: '5 Doyers St, New York, NY 10013, United States',
    description: 'Restaurant Address',
  })
  @Field(() => String)
  address: string;

  @ApiProperty({
    example: 'Asian Cuisine',
    description: 'Restaurant Category',
  })
  @Field(() => String)
  category: string;

  constructor(projection: Restaurant) {
    this.id = projection.id;
    this.name = projection.name;
    this.address = projection.address;
    this.category = projection.category;
  }
}
