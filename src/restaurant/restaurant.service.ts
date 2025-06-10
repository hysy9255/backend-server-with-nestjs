import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RestaurantRepository } from './repositories/restaurant-repository.interface';
import { RESTAURANT_ERROR_MESSAGES } from 'src/constants/errorMessages';
import { CreateRestaurantInput } from './dtos/createRestaurantInput.dto';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { RestaurantRegistrationService } from './domain/restaurant-registration.service';
import { RestaurantMapper } from './mapper/restaurant.mapper';
import { OwnerMapper } from 'src/user/mapper/owner.mapper';
import { OwnerRepository } from 'src/user/repositories/interfaces/owner-repository.interface';
import { RestaurantEntity } from './domain/restaurant.entity';
import { RestaurantSummaryProjection } from './projections/restaurantSummary.projection';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('RestaurantRepository')
    private readonly restaurantRepository: RestaurantRepository,
    @Inject('OwnerRepository')
    private readonly ownerRepository: OwnerRepository,
  ) {}

  // used
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
        RestaurantMapper.toOrmEntity(restaurant),
      );
      await this.ownerRepository.save(OwnerMapper.toOrmEntity(owner));
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_CREATION_FAILED,
      );
    }
  }

  // used
  async getRestaurantSummaryById(
    restaurantId: string,
  ): Promise<RestaurantSummaryProjection> {
    try {
      const restaurantSummary =
        await this.restaurantRepository.findSummary(restaurantId);

      if (!restaurantSummary) {
        throw new BadRequestException(
          RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND,
        );
      }

      return restaurantSummary;
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_FETCHING_FAILED,
      );
    }
  }

  // used
  async getRestaurantSummaries(): Promise<RestaurantSummaryProjection[]> {
    try {
      return await this.restaurantRepository.findSummaries();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANTS_FETCHING_FAILED,
      );
    }
  }

  // used
  async _validateRestaurantExistsOrThrow(restaurantId: string): Promise<void> {
    try {
      const restaurantRecord =
        await this.restaurantRepository.findOneById(restaurantId);

      if (!restaurantRecord) {
        throw new BadRequestException(
          RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND,
        );
      }
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_FETCHING_FAILED,
      );
    }
  }

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
}
