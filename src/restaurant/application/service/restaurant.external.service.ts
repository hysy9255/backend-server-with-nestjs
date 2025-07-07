import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantRegistrationService } from '../../domain/restaurant-registration.service';
import { IRestaurantCommandRepository } from '../../infrastructure/repositories/command/restaurant-command.repository.interface';
import { IRestaurantQueryRepository } from '../../infrastructure/repositories/query/retaurant-query.repository.interface';
import { CreateRestaurantInput } from 'src/restaurant/interface/dtos/restaurant-inputs.dto';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user/user-query.repository.interface';
import { UserAuthService } from 'src/user/application/service/user.auth.service';
import { UserInternalService } from 'src/user/application/service/user.internal.service';
import { Restaurant } from 'src/restaurant/infrastructure/repositories/query/projections/restaurant.projection';
import { RestaurantMapper } from '../restaurant.mapper';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('IRestaurantCommandRepository')
    private readonly restaurantCmdRepo: IRestaurantCommandRepository,
    @Inject('IRestaurantQueryRepository')
    private readonly restaurantQryRepo: IRestaurantQueryRepository,
    private readonly userInternalService: UserInternalService,
    private readonly userAuthService: UserAuthService,
  ) {}

  async createRestaurant(
    user: UserQueryProjection,
    createRestaurantInput: CreateRestaurantInput,
  ) {
    const owner = await this.userAuthService._getOwner(user.id);
    const restaurant = RestaurantRegistrationService.register(
      owner,
      createRestaurantInput,
    );

    await this.restaurantCmdRepo.save(RestaurantMapper.toOrmEntity(restaurant));
    await this.userInternalService._updateOwner(owner);
  }

  async getRestaurant(restaurantId: string): Promise<Restaurant> {
    const result = await this.restaurantQryRepo.findOne(restaurantId);
    if (!result) {
      throw new NotFoundException('RESTAURANT NOT FOUND');
    }
    return result;
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return await this.restaurantQryRepo.findMany();
  }
}
