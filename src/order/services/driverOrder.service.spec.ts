import { Test, TestingModule } from '@nestjs/testing';
import { DriverOrderService } from './driverOrder.service';
import { User } from 'src/user/domain/user.entity';
import { UserRole } from 'src/constants/userRole';
import { OrderStatus } from 'src/constants/orderStatus';

const mockOrderRepository = {
  findAvailableOrdersForDriver: jest.fn(),
  save: jest.fn(),
  findOneById: jest.fn(),
};

describe('DriverOrderService', () => {
  let module: TestingModule;
  let driverOrderService: DriverOrderService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        DriverOrderService,
        {
          provide: 'OrderRepository',
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    driverOrderService = module.get<DriverOrderService>(DriverOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('availableOrders', () => {
    it('should return available orders for a driver', async () => {
      // given
      const driver = new User('driver@email.com', '1234', UserRole.Delivery);
      const orders = [{ id: 'order-1' }, { id: 'order-2' }];
      mockOrderRepository.findAvailableOrdersForDriver.mockResolvedValue(
        orders,
      );

      // when
      const result = await driverOrderService.availableOrders(driver);

      // then
      expect(result).toEqual(orders);
      expect(
        mockOrderRepository.findAvailableOrdersForDriver,
      ).toHaveBeenCalledWith(driver);
    });
  });

  describe('acceptOrder', () => {
    it('should assign a driver to an order', async () => {
      // given
      const driver = new User('driver@email.com', 'pw', UserRole.Delivery);
      const orderId = 'order-1';

      const mockOrder = {
        id: orderId,
        status: OrderStatus.Accepted,
        assignDriver: jest.fn(),
      };
      mockOrderRepository.findOneById.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      // when
      const result = await driverOrderService.acceptOrder(orderId, driver);

      // then
      expect(mockOrder.assignDriver).toHaveBeenCalledWith(driver);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('rejectOrder', () => {
    it('should mark an order as rejected by driver', async () => {
      // given
      const driver = new User('driver@email.com', 'pw', UserRole.Delivery);
      const orderId = 'order-1';

      const mockOrder = {
        id: orderId,
        status: OrderStatus.Accepted,
        markRejectedByDriver: jest.fn(),
      };
      mockOrderRepository.findOneById.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);
      // when
      const result = await driverOrderService.rejectOrder(orderId, driver);
      // then
      expect(mockOrder.markRejectedByDriver).toHaveBeenCalledWith(driver);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });
  });

  describe('pickupOrder', () => {
    it('should mark an order as picked up by driver', async () => {
      // given
      const driver = new User('driver@email.com', 'pw', UserRole.Delivery);
      const orderId = 'order-1';

      const mockOrder = {
        id: orderId,
        status: OrderStatus.Accepted,
        markPickedUp: jest.fn(),
      };
      mockOrderRepository.findOneById.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);
      // when
      const result = await driverOrderService.pickupOrder(orderId, driver);
      // then
      expect(mockOrder.markPickedUp).toHaveBeenCalledWith(driver);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });
  });

  describe('completeOrder', () => {
    it('should mark an order as delivered up by driver', async () => {
      // given
      const driver = new User('driver@email.com', 'pw', UserRole.Delivery);
      const orderId = 'order-1';

      const mockOrder = {
        id: orderId,
        status: OrderStatus.Accepted,
        markDelivered: jest.fn(),
      };
      mockOrderRepository.findOneById.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);
      // when
      const result = await driverOrderService.completeOrder(orderId, driver);
      // then
      expect(mockOrder.markDelivered).toHaveBeenCalledWith(driver);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });
  });

  describe('getOrderOrThrow', () => {
    it('should throw an error if order is not found', async () => {
      // given
      const orderId = 'non-existent-order';
      mockOrderRepository.findOneById.mockResolvedValue(null);

      // when & then
      await expect(
        driverOrderService['getOrderOrThrow'](orderId),
      ).rejects.toThrow('Order not found');
    });
  });
});
