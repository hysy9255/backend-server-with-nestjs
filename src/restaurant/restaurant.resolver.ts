import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantInput } from './dtos/CreateRestaurant.dto';
import { Restaurant } from './domain/restaurant.entity';
import { GetRestaurantInput } from './dtos/GetRestaurant.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => Restaurant)
  @UseGuards(AuthGuard)
  async createRestaurant(
    @Context() context,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<Restaurant> {
    const user = context.req.user;
    return this.restaurantService.createRestaurant(user, createRestaurantInput);
  }

  @Query(() => Restaurant)
  async getRestaurant(
    @Args('input') getRestaurantInput: GetRestaurantInput,
  ): Promise<Restaurant> {
    return this.restaurantService.getRestaurant(getRestaurantInput);
  }

  @Query(() => [Restaurant])
  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAllRestaurants();
  }
}
