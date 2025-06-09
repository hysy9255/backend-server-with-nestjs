import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

// import { CreateRestaurantInput } from './dtos/createRestaurant.dto';
// import { GetRestaurantInput } from './dtos/getRestaurant.dto';
import { RestaurantRepository } from './repositories/restaurant-repository.interface';
import { RESTAURANT_ERROR_MESSAGES } from 'src/constants/errorMessages';

import { CreateRestaurantInput } from './dtos/createRestaurantInput.dto';
import { GetRestaurantInput } from './dtos/getRestaurantInput.dto';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { RestaurantRegistrationService } from './domain/restaurant-registration.service';
import { RestaurantMapper } from './mapper/restaurant.mapper';
import { OwnerMapper } from 'src/user/mapper/owner.mapper';
import { OwnerRepository } from 'src/user/repositories/interfaces/owner-repository.interface';
import { RestaurantEntity } from './domain/restaurant.entity';
import { RestaurantDTO } from './dtos/restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('RestaurantRepository')
    private readonly restaurantRepository: RestaurantRepository,
    @Inject('OwnerRepository')
    private readonly ownerRepository: OwnerRepository,
  ) {}

  async createRestaurant(
    owner: OwnerEntity,
    { name, address, category }: CreateRestaurantInput,
  ) {
    try {
      const restaurant = RestaurantRegistrationService.register(
        owner,
        name,
        address,
        category,
      );

      await this.restaurantRepository.save(
        RestaurantMapper.toRecord(restaurant),
      );
      await this.ownerRepository.save(OwnerMapper.toRecord(owner));
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_CREATION_FAILED,
      );
    }
  }

  // async createRestaurant(
  //   user: User,
  //   { name, address, category }: CreateRestaurantInput,
  // ): Promise<Restaurant> {
  //   try {
  //     const existingRestaurant =
  //       await this.restaurantRepository.findOneByOwner(user);
  //     if (existingRestaurant) {
  //       throw new BadRequestException(
  //         RESTAURANT_ERROR_MESSAGES.USER_ALREADY_OWNS_RESTAURANT,
  //       );
  //     }

  //     const restaurant = new Restaurant(name, address, category);
  //     return this.restaurantRepository.save(user, restaurant);
  //   } catch (e) {
  //     console.error(e);
  //     if (e instanceof HttpException) throw e;
  //     throw new InternalServerErrorException(
  //       RESTAURANT_ERROR_MESSAGES.RESTAURANT_CREATION_FAILED,
  //     );
  //   }
  // }

  async getRestaurantEntityById(id: string): Promise<RestaurantEntity> {
    try {
      const restaurantRecord = await this.restaurantRepository.findOneById(id);

      if (!restaurantRecord) {
        throw new BadRequestException(
          RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND,
        );
      }

      return RestaurantMapper.toDomain(restaurantRecord);
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_FETCHING_FAILED,
      );
    }
  }

  async getRestaurantById(restaurantId: string): Promise<RestaurantEntity> {
    try {
      const restaurantRecord =
        await this.restaurantRepository.findOneById(restaurantId);

      if (!restaurantRecord) {
        throw new BadRequestException(
          RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND,
        );
      }

      return RestaurantMapper.toDomain(restaurantRecord);
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_FETCHING_FAILED,
      );
    }
  }

  async getRestaurant({ id }: GetRestaurantInput): Promise<RestaurantDTO> {
    try {
      const restaurantRecord = await this.restaurantRepository.findOneById(id);

      if (!restaurantRecord) {
        throw new BadRequestException(
          RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND,
        );
      }

      return new RestaurantDTO(RestaurantMapper.toDomain(restaurantRecord));
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_FETCHING_FAILED,
      );
    }
  }

  async getAllRestaurants(): Promise<RestaurantDTO[]> {
    try {
      // return this.restaurantRepository.find();
      const restaurantRecords = await this.restaurantRepository.find();
      const restaurants = restaurantRecords.map((restaurantRecord) =>
        RestaurantMapper.toDomain(restaurantRecord),
      );
      return restaurants.map((restaurant) => new RestaurantDTO(restaurant));
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANTS_FETCHING_FAILED,
      );
    }
  }
}
