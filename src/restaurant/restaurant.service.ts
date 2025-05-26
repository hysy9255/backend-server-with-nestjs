import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Restaurant } from './domain/restaurant.entity';
// import { CreateRestaurantInput } from './dtos/createRestaurant.dto';
// import { GetRestaurantInput } from './dtos/getRestaurant.dto';
import { RestaurantRepository } from './repositories/restaurant-repository.interface';
import { RESTAURANT_ERROR_MESSAGES } from 'src/constants/errorMessages';
import { User } from 'src/user/domain/user.entity';
import { CreateRestaurantInput } from './dtos/createRestaurantInput.dto';
import { GetRestaurantInput } from './dtos/getRestaurantInput.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('RestaurantRepository')
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  async createRestaurant(
    user: User,
    { name, address, category }: CreateRestaurantInput,
  ): Promise<Restaurant> {
    try {
      const existingRestaurant =
        await this.restaurantRepository.findOneByOwner(user);
      if (existingRestaurant) {
        throw new BadRequestException(
          RESTAURANT_ERROR_MESSAGES.USER_ALREADY_OWNS_RESTAURANT,
        );
      }

      const restaurant = new Restaurant(name, address, category);
      return this.restaurantRepository.save(user, restaurant);
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_CREATION_FAILED,
      );
    }
  }

  async getRestaurant({ id }: GetRestaurantInput): Promise<Restaurant> {
    try {
      const restaurant = await this.restaurantRepository.findOneById(id);

      if (!restaurant) {
        throw new BadRequestException(
          RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND,
        );
      }
      return restaurant;
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_FETCHING_FAILED,
      );
    }
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      return this.restaurantRepository.find();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANTS_FETCHING_FAILED,
      );
    }
  }
}
