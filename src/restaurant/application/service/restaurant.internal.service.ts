import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RESTAURANT_ERROR_MESSAGES } from 'src/constants/errorMessages';
import { IRestaurantCommandRepository } from '../../infrastructure/repositories/command/restaurant-command.repository.interface';

@Injectable()
export class RestaurantInternalService {
  constructor(
    @Inject('IRestaurantCommandRepository')
    private readonly restaurantCmdRepo: IRestaurantCommandRepository,
  ) {}

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
