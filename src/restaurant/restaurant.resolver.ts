import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantInput } from './dtos/createRestaurantInput.dto';

import { GetRestaurantInput } from './dtos/getRestaurantInput.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/domain/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { AuthOwner } from 'src/auth/auth-owner.decorator';
import { RestaurantDTO } from './dtos/restaurant.dto';

@Resolver()
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // used
  @Mutation(() => Boolean)
  async createRestaurant(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<boolean> {
    await this.restaurantService.createRestaurant(owner, createRestaurantInput);
    return true;
  }

  // used
  @Query(() => RestaurantDTO)
  async getRestaurant(
    @Args('input') { id: restaurantId }: GetRestaurantInput,
  ): Promise<RestaurantDTO> {
    return new RestaurantDTO(
      await this.restaurantService.getRestaurantSummaryById(restaurantId),
    );
  }

  // used
  @Query(() => [RestaurantDTO])
  async getRestaurants(): Promise<RestaurantDTO[]> {
    const restaurants = await this.restaurantService.getRestaurantSummaries();
    return restaurants.map((restaurant) => new RestaurantDTO(restaurant));
  }
}
