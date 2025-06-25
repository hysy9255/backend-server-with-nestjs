import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RESTAURANT_ERROR_MESSAGES } from 'src/constants/errorMessages';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { RestaurantRegistrationService } from '../../domain/restaurant-registration.service';
import { RestaurantMapper } from './mapper/restaurant.mapper';
import { IRestaurantCommandRepository } from '../../infrastructure/repositories/command/restaurant-command.repository.interface';
import {
  IRestaurantQueryRepository,
  RestaurantQueryProjection,
} from '../../infrastructure/repositories/query/retaurant-query.repository.interface';
import { CreateRestaurantInput } from 'src/restaurant/interface/dtos/restaurant-inputs.dto';
import { UserService } from 'src/user/application/service/user.service';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';
import { UserAuthService } from 'src/user/application/service/user-auth.service';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('IRestaurantCommandRepository')
    private readonly restaurantCmdRepo: IRestaurantCommandRepository,
    @Inject('IRestaurantQueryRepository')
    private readonly restaurantQryRepo: IRestaurantQueryRepository,
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService,
  ) {}

  // used
  async createRestaurant(
    user: UserQueryProjection,
    { name, address, category }: CreateRestaurantInput,
  ) {
    if (user.role !== 'Owner') {
      throw new BadRequestException('Invalid requeset');
    }

    const owner = await this.userAuthService.getOwnerForAuth(user.id);

    if (!owner) {
      throw new BadRequestException('Owner not found');
    }

    const restaurant = RestaurantRegistrationService.register(
      owner,
      name,
      address,
      category,
    );

    await this.restaurantCmdRepo.save(RestaurantMapper.toOrmEntity(restaurant));
    await this.userService.updateOwner(owner);
  }

  // used
  async getRestaurantSummaryById(
    restaurantId: string,
  ): Promise<RestaurantQueryProjection> {
    const restaurantSummary =
      await this.restaurantQryRepo.findSummary(restaurantId);

    if (!restaurantSummary) {
      throw new BadRequestException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND,
      );
    }

    return restaurantSummary;
  }

  // used
  async getRestaurantSummaries(): Promise<RestaurantQueryProjection[]> {
    return await this.restaurantQryRepo.findSummaries();
  }

  // used
  async _validateRestaurantExistsOrThrow(restaurantId: string): Promise<void> {
    const restaurantRecord =
      await this.restaurantCmdRepo.findOneById(restaurantId);

    if (!restaurantRecord) {
      throw new BadRequestException(
        RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND,
      );
    }
  }
}
