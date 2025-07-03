import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { OrderEntity } from '../../domain/order.entity';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OrderMapper } from './mapper/order.mapper';
import { IOrderCommandRepository } from '../../infrastructure/repositories/command/order-command.repository.interface';
import { IOrderQueryRepository } from '../../infrastructure/repositories/query/order-query.repository.interface';
import { OwnerOrderSummaryProjection } from '../../infrastructure/repositories/query/projections/order.projection';
import { OwnerOrderService } from './ownerOrder.service';

jest.mock('./mapper/order.mapper');

describe('OwnerOrderService', () => {
  let service: OwnerOrderService;
  let mockOrderCmdRepo: Partial<IOrderCommandRepository>;
  let mockOrderQryRepo: Partial<IOrderQueryRepository>;

  const owner = {
    hasRestaurant: jest.fn(),
    restaurantId: 'rest-1',
    ownsRestaurantOf: jest.fn(),
    canAccessOrderOf: jest.fn(),
  } as unknown as OwnerEntity;

  const mockOrder = {
    markAccepted: jest.fn(),
    markRejected: jest.fn(),
    markReady: jest.fn(),
  } as unknown as OrderEntity;

  beforeEach(() => {
    mockOrderCmdRepo = {
      findOneById: jest.fn(),
      save: jest.fn(),
    };
    mockOrderQryRepo = {
      findOrderSummariesForOwner: jest.fn(),
      findOrderSummaryForOwner: jest.fn(),
    };

    (OrderMapper.toDomain as jest.Mock).mockReturnValue(mockOrder);
    (OrderMapper.toOrmEntity as jest.Mock).mockReturnValue({});

    service = new OwnerOrderService(
      mockOrderCmdRepo as IOrderCommandRepository,
      mockOrderQryRepo as IOrderQueryRepository,
    );
  });

  describe('getOrders', () => {
    it('should return orders if owner has restaurant', async () => {
      owner.hasRestaurant = jest.fn().mockReturnValue(true);
      const orders: OwnerOrderSummaryProjection[] = [{ id: 'o1' }] as any;
      (
        mockOrderQryRepo.findOrderSummariesForOwner as jest.Mock
      ).mockResolvedValue(orders);

      const result = await service.getOrders(owner);
      expect(result).toEqual(orders);
    });

    it('should throw if owner has no restaurant', async () => {
      owner.hasRestaurant = jest.fn().mockReturnValue(false);
      await expect(service.getOrders(owner)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getOrder', () => {
    it('should return order if it belongs to owner', async () => {
      owner.hasRestaurant = jest.fn().mockReturnValue(true);
      owner.ownsRestaurantOf = jest.fn().mockReturnValue(true);

      const projection = {
        id: 'order1',
        restaurantId: 'rest-1',
      } as OwnerOrderSummaryProjection;
      (
        mockOrderQryRepo.findOrderSummaryForOwner as jest.Mock
      ).mockResolvedValue(projection);

      const result = await service.getOrder(owner, 'order1');
      expect(result).toEqual(projection);
    });

    it('should throw if owner has no restaurant', async () => {
      owner.hasRestaurant = jest.fn().mockReturnValue(false);
      await expect(service.getOrder(owner, 'order1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if order not found', async () => {
      owner.hasRestaurant = jest.fn().mockReturnValue(true);
      (
        mockOrderQryRepo.findOrderSummaryForOwner as jest.Mock
      ).mockResolvedValue(null);

      await expect(service.getOrder(owner, 'missing')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if order does not belong to owner', async () => {
      owner.hasRestaurant = jest.fn().mockReturnValue(true);
      owner.ownsRestaurantOf = jest.fn().mockReturnValue(false);
      const projection = {
        id: 'order1',
        restaurantId: 'other-rest',
      } as OwnerOrderSummaryProjection;
      (
        mockOrderQryRepo.findOrderSummaryForOwner as jest.Mock
      ).mockResolvedValue(projection);

      await expect(service.getOrder(owner, 'order1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('acceptOrder', () => {
    it('should validate, accept, and save', async () => {
      (mockOrderCmdRepo.findOneById as jest.Mock).mockResolvedValue({});
      owner.canAccessOrderOf = jest.fn().mockReturnValue(true);

      await service.acceptOrder('order1', owner);

      expect(mockOrder.markAccepted).toHaveBeenCalled();
      expect(mockOrderCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('rejectOrder', () => {
    it('should validate, reject, and save', async () => {
      (mockOrderCmdRepo.findOneById as jest.Mock).mockResolvedValue({});
      owner.canAccessOrderOf = jest.fn().mockReturnValue(true);

      await service.rejectOrder('order1', owner);

      expect(mockOrder.markRejected).toHaveBeenCalled();
      expect(mockOrderCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('markOrderAsReady', () => {
    it('should validate, mark ready, and save', async () => {
      (mockOrderCmdRepo.findOneById as jest.Mock).mockResolvedValue({});
      owner.canAccessOrderOf = jest.fn().mockReturnValue(true);

      await service.markOrderAsReady('order1', owner);

      expect(mockOrder.markReady).toHaveBeenCalled();
      expect(mockOrderCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('_getOrderOrThrow', () => {
    it('should throw if order not found', async () => {
      (mockOrderCmdRepo.findOneById as jest.Mock).mockResolvedValue(null);
      await expect(service['_getOrderOrThrow']('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('_validateOrderAccessRights', () => {
    it('should throw if order not owned by owner', () => {
      owner.canAccessOrderOf = jest.fn().mockReturnValue(false);
      expect(() =>
        service['_validateOrderAccessRights'](mockOrder, owner),
      ).toThrow(ForbiddenException);
    });
  });
});
