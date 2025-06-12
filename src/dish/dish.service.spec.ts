import { Test, TestingModule } from '@nestjs/testing';
import { DishService } from './dish.service';
import { MemoryDishRepository } from './repositories/memory-dish.repository';
import { MemoryRestaurantRepository } from 'src/restaurant/repositories/memory-restaurant.repository';
import { Restaurant } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm.entity';
import { User } from 'src/user/orm-entities/user.orm.entity';
import { UserRole } from 'src/constants/userRole';
import { Dish } from './domain/dish.entity';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('DishService', () => {
  let module: TestingModule;
  let dishService: DishService;
  let dishRepository: MemoryDishRepository;
  let restaurantRepository: MemoryRestaurantRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        DishService,
        { provide: 'DishRepository', useClass: MemoryDishRepository },
        {
          provide: 'RestaurantRepository',
          useClass: MemoryRestaurantRepository,
        },
      ],
    }).compile();

    dishService = module.get<DishService>(DishService);
    dishRepository = module.get<MemoryDishRepository>('DishRepository');
    restaurantRepository = module.get<MemoryRestaurantRepository>(
      'RestaurantRepository',
    );
  });

  afterEach(() => {
    dishRepository.clear();
    restaurantRepository.clear();
  });

  describe('createDish', () => {
    it('should return a dish when createDish is called', async () => {
      // given
      const user = new User('test@example.com', 'password', UserRole.Owner);
      const restaurant = new Restaurant('Starbucks', '123 Main St', 'cafe');
      await restaurantRepository.save(user, restaurant);

      // when
      const result = await dishService.createDish(user, {
        name: 'Latte',
        price: '5.0',
      });
      // then
      expect(result).toBeDefined();
      expect(result.name).toBe('Latte');
    });
  });

  describe('getDish', () => {
    it('should return a dish when getDish is called', async () => {
      // given
      const restaurant = new Restaurant('Starbucks', '123 Main St', 'cafe');
      const dish = new Dish('Latte', '5.0');
      await dishRepository.save(restaurant, dish);

      // when
      const result = await dishService.getDish({ id: dish.id });

      // then
      expect(result).toBeDefined();
      expect(result.name).toBe('Latte');
      expect(result.price).toBe('5.0');
    });
  });

  describe('getAllDishesByRestaurant', () => {
    it('should return all dishes for a restaurant', async () => {
      // given
      const restaurant = new Restaurant('Starbucks', '123 Main St', 'cafe');
      const dish1 = new Dish('Latte', '5.0');
      const dish2 = new Dish('Espresso', '3.0');
      await dishRepository.save(restaurant, dish1);
      await dishRepository.save(restaurant, dish2);

      // when
      const result = await dishService.getAllDishesByRestaurant(restaurant.id);

      // then
      expect(result).toBeDefined();
      expect(result?.length).toBe(2);
    });
  });

  describe('deleteDish', () => {
    it('should delete a dish when deleteDish is called', async () => {
      // given
      const restaurant = new Restaurant('Starbucks', '123 Main St', 'cafe');
      const dish = new Dish('Latte', '5.0');
      await dishRepository.save(restaurant, dish);

      // when
      const result = await dishService.deleteDish({ id: dish.id });

      // then
      expect(result).toBeDefined();
      expect(result.id).toBe(dish.id);
    });
  });
});
