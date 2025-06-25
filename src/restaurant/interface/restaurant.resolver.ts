import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from '../application/service/restaurant.service';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { Role } from 'src/auth/role.decorator';
import {
  CreateRestaurantInput,
  GetRestaurantInput,
} from './dtos/restaurant-inputs.dto';
import { RestaurantSummaryDTO } from './dtos/restaurant-outputs.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';

@Resolver()
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // used
  @Mutation(() => Boolean)
  @Role(['Owner'])
  async createRestaurant(
    // @AuthOwner() owner: OwnerEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<boolean> {
    await this.restaurantService.createRestaurant(user, createRestaurantInput);
    return true;
  }

  // used
  @Query(() => RestaurantSummaryDTO)
  @Role(['Any'])
  async getRestaurant(
    @Args('input') { id: restaurantId }: GetRestaurantInput,
  ): Promise<RestaurantSummaryDTO> {
    return new RestaurantSummaryDTO(
      await this.restaurantService.getRestaurantSummaryById(restaurantId),
    );
  }

  // used
  @Query(() => [RestaurantSummaryDTO])
  @Role(['Any'])
  async getRestaurants(): Promise<RestaurantSummaryDTO[]> {
    const restaurants = await this.restaurantService.getRestaurantSummaries();
    return restaurants.map(
      (restaurant) => new RestaurantSummaryDTO(restaurant),
    );
  }
}
