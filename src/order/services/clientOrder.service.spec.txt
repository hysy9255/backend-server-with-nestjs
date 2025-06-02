import { Test, TestingModule } from '@nestjs/testing';
import { ClientOrderService } from './clientOrder.service';
import { User } from 'src/user/domain/user.entity';
import { UserRole } from 'src/constants/userRole';

import { RestaurantService } from 'src/restaurant/restaurant.service';
import { CreateOrderInput } from '../dtos/createOrder.dto';

const mockOrderRepository = {
  save: jest.fn(),
  findOneById: jest.fn(),
  findHistoryByUserId: jest.fn(),
};

const mockRestaurantService = {
  getRestaurant: jest.fn(),
};

describe('ClientOrderService', () => {
  let module: TestingModule;
  let clientOrderSerivce: ClientOrderService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ClientOrderService,
        {
          provide: 'OrderRepository',
          useValue: mockOrderRepository,
        },
        {
          provide: RestaurantService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    clientOrderSerivce = module.get<ClientOrderService>(ClientOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order for a user', async () => {
      // given
      const user = new User('test@text.com', 'password', UserRole.Client);
      const createOrderInput: CreateOrderInput = {
        restaurantId: 'restaurantId',
      };

      const fakeOrder = {
        id: 'order-abc',
      };

      mockOrderRepository.save.mockResolvedValue(fakeOrder);
      mockRestaurantService.getRestaurant.mockResolvedValue({
        id: createOrderInput.restaurantId,
        name: 'Test Restaurant',
      });

      // when
      const order = await clientOrderSerivce.createOrder(
        user,
        createOrderInput,
      );

      // then
      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
    });
  });

  describe('getOrder', () => {
    it('should return an order by ID', async () => {
      // given
      const mockCustomer = new User(
        'customer@test.com',
        'password',
        UserRole.Client,
      );
      const mockOrderId = 'order-123';

      mockOrderRepository.findOneById.mockResolvedValue({
        id: mockOrderId,
        customer: mockCustomer,
      });
      // when
      const result = await clientOrderSerivce.getOrder(
        mockCustomer,
        mockOrderId,
      );

      // then
      expect(result).toBeDefined();
      expect(result.id).toBe(mockOrderId);
    });

    it('should throw an error if order not found', async () => {
      // given
      const mockCustomer = new User(
        'customer@test.com',
        'password',
        UserRole.Client,
      );
      mockOrderRepository.findOneById.mockResolvedValue(null);

      // when & then
      await expect(
        clientOrderSerivce.getOrder(mockCustomer, 'non-existent-id'),
      ).rejects.toThrow('Order not found');
    });
  });

  describe('getOrderHistory', () => {
    it('should return order history for a user', async () => {
      // given
      const mockCustomer = new User(
        'customer@test.com',
        'password',
        UserRole.Client,
      );

      const fakeOrders = [{ id: 'order-1' }, { id: 'order-2' }];

      mockOrderRepository.findHistoryByUserId.mockResolvedValue(fakeOrders);

      // when
      const orders = await clientOrderSerivce.getOrderHistory(mockCustomer);

      // then
      expect(orders).toBeDefined();
      expect(orders.length).toBe(2);
    });
  });
});
