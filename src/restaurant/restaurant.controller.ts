import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantInput } from './dtos/CreateRestaurant.dto';
import { Restaurant } from './domain/restaurant.entity';
import { RestaurantOutput } from './dtos/RestaurantOutput.dto';

@Controller('api/restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  async createRestaurant(
    @Req() req: Request,
    @Body() createRestaurantInput: CreateRestaurantInput,
  ): Promise<RestaurantOutput> {
    const user = req['user'];
    const restaurant = await this.restaurantService.createRestaurant(
      user,
      createRestaurantInput,
    );
    return new RestaurantOutput(restaurant);
  }

  @Get(':id')
  async getRestaurant(@Param('id') id: string): Promise<RestaurantOutput> {
    const restaurant = await this.restaurantService.getRestaurant({ id });
    return new RestaurantOutput(restaurant);
  }

  @Get()
  async getAllRestaurants(): Promise<RestaurantOutput[]> {
    const restaurants = await this.restaurantService.getAllRestaurants();
    return restaurants.map((restaurant) => new RestaurantOutput(restaurant));
  }
}
