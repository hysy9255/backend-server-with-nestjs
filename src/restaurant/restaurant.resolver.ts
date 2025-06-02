import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantInput } from './dtos/createRestaurantInput.dto';

import { GetRestaurantInput } from './dtos/getRestaurantInput.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/domain/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver()
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // @Mutation(() => Restaurant)
  // @UseGuards(AuthGuard)
  // async createRestaurant(
  //   // @Context() context,
  //   @AuthUser() user: UserEntity
  //   @Args('input') createRestaurantInput: CreateRestaurantInput,
  // ): Promise<Restaurant> {
  //   // const user = context.req.user;
  //   return this.restaurantService.registerRestaurant(user, createRestaurantInput);
  // }

  // @Query(() => Restaurant)
  // async getRestaurant(
  //   @Args('input') getRestaurantInput: GetRestaurantInput,
  // ): Promise<Restaurant> {
  //   return this.restaurantService.getRestaurant(getRestaurantInput);
  // }

  // @Query(() => [Restaurant])
  // async getAllRestaurants(): Promise<Restaurant[]> {
  //   return this.restaurantService.getAllRestaurants();
  // }
}
