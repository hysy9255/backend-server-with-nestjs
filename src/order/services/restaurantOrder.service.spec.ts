import { Test, TestingModule } from '@nestjs/testing';
import { DriverOrderService } from './driverOrder.service';
import { RestaurantOrderService } from './restaurantOrder.service';
import { User } from 'src/user/domain/user.entity';
import { UserRole } from 'src/constants/userRole';
import { Restaurant } from 'src/restaurant/domain/restaurant.entity';

const mockOrderRepository = {
  findByRestaurant: jest.fn(),
  save: jest.fn(),
  findOneById: jest.fn(),
};

describe('RestaurantOrderService', () => {
  let module: TestingModule;
  let restaurantOrderService: RestaurantOrderService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        RestaurantOrderService,
        {
          provide: 'OrderRepository',
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    restaurantOrderService = module.get<RestaurantOrderService>(
      RestaurantOrderService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrdersByRestaurant', () => {
    it('should return orders for a restaurant', async () => {
      // given
      const restaurantId = 'restaurant-123';
      const orders = [{ id: 'order-1' }, { id: 'order-2' }];
      mockOrderRepository.findByRestaurant.mockResolvedValue(orders);

      // when
      const result =
        await restaurantOrderService.getOrdersByRestaurant(restaurantId);

      // then
      expect(result).toEqual(orders);
      expect(mockOrderRepository.findByRestaurant).toHaveBeenCalledWith(
        restaurantId,
      );
    });
  });

  describe('getOrder', () => {
    it('should return an order by ID', async () => {
      // given
      const orderId = 'order-123';
      const order = { id: orderId, status: 'pending' };
      mockOrderRepository.findOneById.mockResolvedValue(order);

      // when
      const result = await restaurantOrderService.getOrder(orderId);

      // then
      expect(result).toEqual(order);
      expect(mockOrderRepository.findOneById).toHaveBeenCalledWith(orderId);
    });
  });

  describe('acceptOrder', () => {
    it('should accept an order', async () => {
      // given
      const owner = new User('user-123', 'password', UserRole.Owner);
      const restaurant = new Restaurant(
        'Test Restaurant',
        '123 Test St',
        'cuisine',
      );
      owner.restaurant = restaurant;
      const orderId = 'order-123';
      const order = {
        id: orderId,
        status: 'pending',
        markAccepted: jest.fn(),
        restaurant,
      };

      mockOrderRepository.findOneById.mockResolvedValue(order);
      mockOrderRepository.save.mockResolvedValue(order);

      // when
      const result = await restaurantOrderService.acceptOrder(orderId, owner);

      // then
      expect(order.markAccepted).toHaveBeenCalled();
      expect(mockOrderRepository.save).toHaveBeenCalledWith(order);
      expect(result).toEqual(order);
    });
  });

  //   describe('rejectOrder', () => {
  //     it('should reject an order', async () => {
  //       // given
  //       const owner = new User('user-123', 'password', UserRole.Owner);
  //       const restaurant = new Restaurant(
  //         'Test Restaurant',
  //         '123 Test St',
  //         'cuisine',
  //       );
  //       owner.restaurant = restaurant;
  //       const orderId = 'order-123';
  //       const order = {
  //         id: orderId,
  //         status: 'pending',
  //         markRejected: jest.fn(),
  //         restaurant,
  //       };
  //       mockOrderRepository.findOneById.mockResolvedValue(order);
  //       mockOrderRepository.save.mockResolvedValue(order);

  //       // when
  //       const result = await restaurantOrderService.rejectOrder(orderId, owner);

  //       // then
  //       expect(order.markRejected).toHaveBeenCalled();
  //       expect(mockOrderRepository.save).toHaveBeenCalledWith(order);
  //       expect(result).toEqual(order);
  //     });
  //   });

  //   describe('markOrderAsReady', () => {
  //     it('should mark an order as ready', async () => {
  //       // given
  //       const owner = new User('user-123', 'password', UserRole.Owner);
  //       const restaurant = new Restaurant(
  //         'Test Restaurant',
  //         '123 Test St',
  //         'cuisine',
  //       );
  //       owner.restaurant = restaurant;
  //       const orderId = 'order-123';
  //       const order = {
  //         id: orderId,
  //         status: 'pending',
  //         markReady: jest.fn(),
  //         restaurant,
  //       };

  //       mockOrderRepository.findOneById.mockResolvedValue(order);
  //       mockOrderRepository.save.mockResolvedValue(order);

  //       // when
  //       const result = await restaurantOrderService.markOrderAsReady(
  //         orderId,
  //         owner,
  //       );

  //       // then
  //       expect(order.markReady).toHaveBeenCalled();
  //       expect(mockOrderRepository.save).toHaveBeenCalledWith(order);
  //       expect(result).toEqual(order);
  //     });
  //   });

  //   describe('getOrderOrThrow', () => {
  //     it('should throw an error if order is not found', async () => {
  //       // given
  //       const orderId = 'non-existent-order';
  //       mockOrderRepository.findOneById.mockResolvedValue(null);

  //       // when & then
  //       await expect(
  //         restaurantOrderService['getOrderOrThrow'](orderId),
  //       ).rejects.toThrow('Order not found');
  //     });
  //   });
});
