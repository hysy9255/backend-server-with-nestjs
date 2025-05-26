import { Test, TestingModule } from '@nestjs/testing';
import { ClientOrderService } from './clientOrder.service';
import { User } from 'src/user/domain/user.entity';
import { UserRole } from 'src/constants/userRole';
import { CreateOrderInput } from '../dtos/createOrderInput.dto';
import { RestaurantService } from 'src/restaurant/restaurant.service';

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
        customer: user,
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
      mockOrderRepository.findOneById.mockResolvedValue({
        id: 'order-123',
      });
      // when
      const order = await clientOrderSerivce.getOrder('order-123');

      // then
      expect(order).toBeDefined();
      expect(order.id).toBe('order-123');
    });

    it('should throw an error if order not found', async () => {
      // given
      mockOrderRepository.findOneById.mockResolvedValue(null);

      // when & then
      await expect(
        clientOrderSerivce.getOrder('non-existent-id'),
      ).rejects.toThrow('Order not found');
    });
  });

  describe('getOrderHistory', () => {
    it('should return order history for a user', async () => {
      // given
      const userId = 'user-123';
      const fakeOrders = [
        { id: 'order-1', customerId: userId },
        { id: 'order-2', customerId: userId },
      ];

      mockOrderRepository.findHistoryByUserId.mockResolvedValue(fakeOrders);

      // when
      const orders = await clientOrderSerivce.getOrderHistory(userId);

      // then
      expect(orders).toBeDefined();
      expect(orders.length).toBe(2);
    });
  });
});
