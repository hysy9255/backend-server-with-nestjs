import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDishInput } from './dtos/createDishInput.dto';
import { GetDishInput } from './dtos/getDishInput';
import { DeleteDishInput } from './dtos/deleteDishInput.dto';
import { DISH_ERROR_MESSAGES } from 'src/constants/errorMessages';
import { DishRepository } from './repositories/dish-repository.interface';
import { Dish } from './domain/dish.entity';
// import { User } from 'src/user/orm-records/user.record';
// import { RestaurantRepository } from 'src/restaurant/repositories/restaurant-repository.interface';
import { UserRole } from 'src/constants/userRole';

@Injectable()
export class DishService {
  @Inject('DishRepository')
  private readonly dishRepository: DishRepository;
  // @Inject('RestaurantRepository')
  // private readonly restaurantRepository: RestaurantRepository;

  // async createDish(
  //   user: User,
  //   { name, price }: CreateDishInput,
  // ): Promise<Dish> {
  //   try {
  //     // user.checkUserRole(UserRole.Owner);
  //     const restaurant = await this.restaurantRepository.findOneByOwner(user);
  //     if (!restaurant) {
  //       throw new BadRequestException(
  //         DISH_ERROR_MESSAGES.USER_DOES_NOT_OWN_RESTAURANT,
  //       );
  //     }
  //     const dish = new Dish(name, price);
  //     return await this.dishRepository.save(restaurant, dish);
  //   } catch (e) {
  //     console.error(e);
  //     if (e instanceof HttpException) throw e;
  //     throw new InternalServerErrorException(
  //       DISH_ERROR_MESSAGES.DISH_CREATION_FAILED,
  //     );
  //   }
  // }

  // async getDish({ id }: GetDishInput): Promise<Dish> {
  //   try {
  //     const dish = await this.dishRepository.findOneById(id);
  //     if (!dish) {
  //       throw new BadRequestException(DISH_ERROR_MESSAGES.DISH_NOT_FOUND);
  //     }
  //     return dish;
  //   } catch (e) {
  //     console.error(e);
  //     throw new InternalServerErrorException(
  //       DISH_ERROR_MESSAGES.DISH_FETCHING_FAILED,
  //     );
  //   }
  // }

  // async getAllDishesByRestaurant(restaurantId: string): Promise<Dish[] | null> {
  //   try {
  //     return await this.dishRepository.findByRestaurantId(restaurantId);
  //   } catch (e) {
  //     console.error(e);
  //     throw new InternalServerErrorException(
  //       DISH_ERROR_MESSAGES.DISH_FETCHING_FAILED,
  //     );
  //   }
  // }

  // async deleteDish({ id }: DeleteDishInput) {
  //   try {
  //     await this.dishRepository.deleteOneById(id);
  //     return { id };
  //   } catch (e) {
  //     console.error(e);
  //     throw new InternalServerErrorException(
  //       DISH_ERROR_MESSAGES.DISH_DELETION_FAILED,
  //     );
  //   }
  // }
}
