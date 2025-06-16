import { OrderMapper } from './mapper/order.mapper';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { OrderEntity } from '../../domain/order.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { IOrderCommandRepository } from '../../infrastructure/repositories/command/order-command.repository.interface';
import { IOrderQueryRepository } from '../../infrastructure/repositories/query/order-query.repository.interface';
import { OrderDriverRejectionCommandRepository } from '../../infrastructure/repositories/command/order-driver-rejection-command.repository';
import { DriverOrderSummaryProjection } from '../../infrastructure/repositories/query/projections/order.projection';
import { OrderDriverRejectionOrmEntity } from '../../infrastructure/orm-entities/order-driver-rejection.orm';
import { DriverOrderService } from './driverOrder.service';

jest.mock('./mapper/order.mapper');

describe('DriverOrderService', () => {
  let service: DriverOrderService;
  let mockOrderCmdRepo: Partial<IOrderCommandRepository>;
  let mockOrderQryRepo: Partial<IOrderQueryRepository>;
  let mockOrderDriverRejectCmdRepo: Partial<OrderDriverRejectionCommandRepository>;

  const driver = {
    id: 'driver-1',
    canAccessOrderOf: jest.fn().mockReturnValue(true),
  } as unknown as DriverEntity;

  const mockOrder = {
    assignDriver: jest.fn(),
    markRejectedByDriver: jest.fn(),
    markPickedUp: jest.fn(),
    markDelivered: jest.fn(),
  } as unknown as OrderEntity;

  beforeEach(() => {
    mockOrderCmdRepo = {
      findOneById: jest.fn(),
      save: jest.fn(),
    };

    mockOrderQryRepo = {
      findAvailableOrdersForDriver: jest.fn(),
      findOrderSummaryForDriver: jest.fn(),
    };

    mockOrderDriverRejectCmdRepo = {
      save: jest.fn(),
    };

    (OrderMapper.toDomain as jest.Mock).mockReturnValue(mockOrder);
    (OrderMapper.toOrmEntity as jest.Mock).mockReturnValue({});

    service = new DriverOrderService(
      mockOrderDriverRejectCmdRepo as any,
      mockOrderCmdRepo as any,
      mockOrderQryRepo as any,
    );
  });

  describe('getOrdersForDriver', () => {
    it('should return available orders', async () => {
      const projections: DriverOrderSummaryProjection[] = [
        { id: 'order-1' },
      ] as any;
      mockOrderQryRepo.findAvailableOrdersForDriver = jest
        .fn()
        .mockResolvedValue(projections);

      const result = await service.getOrdersForDriver(driver);
      expect(result).toEqual(projections);
    });
  });

  describe('getOrderForDriver', () => {
    it('should return order if accessible', async () => {
      const summary = {
        id: 'order-1',
        driverId: null,
      } as DriverOrderSummaryProjection;
      mockOrderQryRepo.findOrderSummaryForDriver = jest
        .fn()
        .mockResolvedValue(summary);

      const result = await service.getOrderForDriver(driver, 'order-1');
      expect(result).toEqual(summary);
    });

    it('should throw if order not found', async () => {
      mockOrderQryRepo.findOrderSummaryForDriver = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        service.getOrderForDriver(driver, 'order-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if driver cannot access', async () => {
      const summary = { id: 'order-1' } as DriverOrderSummaryProjection;
      driver.canAccessOrderOf = jest.fn().mockReturnValue(false);
      mockOrderQryRepo.findOrderSummaryForDriver = jest
        .fn()
        .mockResolvedValue(summary);

      await expect(
        service.getOrderForDriver(driver, 'order-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('acceptOrder', () => {
    it('should assign driver and save order', async () => {
      (mockOrderCmdRepo.findOneById as jest.Mock).mockResolvedValue({});
      await service.acceptOrder('order-1', driver);
      expect(mockOrder.assignDriver).toHaveBeenCalledWith(driver);
      expect(mockOrderCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('rejectOrder', () => {
    it('should reject order and save rejection entity', async () => {
      (mockOrderCmdRepo.findOneById as jest.Mock).mockResolvedValue({});
      await service.rejectOrder('order-1', driver);
      expect(mockOrder.markRejectedByDriver).toHaveBeenCalledWith(driver);
      expect(mockOrderCmdRepo.save).toHaveBeenCalled();
      expect(mockOrderDriverRejectCmdRepo.save).toHaveBeenCalledWith(
        new OrderDriverRejectionOrmEntity('order-1', driver.id),
      );
    });
  });

  describe('pickupOrder', () => {
    it('should mark as picked up and save', async () => {
      (mockOrderCmdRepo.findOneById as jest.Mock).mockResolvedValue({});
      await service.pickupOrder('order-1', driver);
      expect(mockOrder.markPickedUp).toHaveBeenCalledWith(driver);
      expect(mockOrderCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('completeDelivery', () => {
    it('should mark as delivered and save', async () => {
      (mockOrderCmdRepo.findOneById as jest.Mock).mockResolvedValue({});
      await service.completeDelivery('order-1', driver);
      expect(mockOrder.markDelivered).toHaveBeenCalledWith(driver);
      expect(mockOrderCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('_getOrderOrThrow', () => {
    it('should throw if order not found', async () => {
      (mockOrderCmdRepo.findOneById as jest.Mock).mockResolvedValue(null);
      await expect(
        service['_getOrderOrThrow']('missing-order'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
