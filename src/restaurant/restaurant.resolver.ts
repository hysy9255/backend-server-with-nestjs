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

  @Mutation(() => Boolean)
  async createRestaurant(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<boolean> {
    await this.restaurantService.createRestaurant(owner, createRestaurantInput);
    return true;
  }

  @Query(() => RestaurantDTO)
  getRestaurant(
    @Args('input') getRestaurantInput: GetRestaurantInput,
  ): Promise<RestaurantDTO> {
    return this.restaurantService.getRestaurant(getRestaurantInput);
  }

  @Query(() => [RestaurantDTO])
  getAllRestaurants(): Promise<RestaurantDTO[]> {
    return this.restaurantService.getAllRestaurants();
  }
}
