import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RESTAURANT_ERROR_MESSAGES } from 'src/constants/errorMessages';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { RestaurantRegistrationService } from '../../domain/restaurant-registration.service';
import { RestaurantMapper } from './mapper/restaurant.mapper';
import { RestaurantEntity } from '../../domain/restaurant.entity';
import { IRestaurantCommandRepository } from '../command/repositories/restaurant-command.repository.interface';
import { IRestaurantQueryRepository } from '../query/repositories/retaurant-query.repository.interface';
import { RestaurantSummaryProjection } from '../query/projections/restaurant.projection';
import { CreateRestaurantInput } from 'src/restaurant/interface/dtos/restaurant-inputs.dto';
import { UserService } from 'src/user/application/service/user.service';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('IRestaurantCommandRepository')
    private readonly restaurantCmdRepo: IRestaurantCommandRepository,
    @Inject('IRestaurantQueryRepository')
    private readonly restaurantQryRepo: IRestaurantQueryRepository,
    private readonly userService: UserService,
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

      await this.restaurantCmdRepo.save(
        RestaurantMapper.toOrmEntity(restaurant),
      );
      await this.userService.updateOwner(owner);
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
        await this.restaurantQryRepo.findSummary(restaurantId);

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
      return await this.restaurantQryRepo.findSummaries();
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
        await this.restaurantCmdRepo.findOneById(restaurantId);

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
      const restaurantRecord = await this.restaurantCmdRepo.findOneById(id);

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
