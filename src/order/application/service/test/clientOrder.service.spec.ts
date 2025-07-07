import { RestaurantService } from 'src/restaurant/application/service/restaurant.external.service';
import { IOrderCommandRepository } from '../../../infrastructure/repositories/command/order-command.repository.interface';
import { IOrderQueryRepository } from '../../../infrastructure/repositories/query/order-query.repository.interface';
import { CreateOrderInput } from 'src/order/interface/dtos/inputs/order-inputs.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  ClientOrderPreviewProjection,
  ClientOrderSummaryProjection,
} from '../../../infrastructure/repositories/query/projections/order.projection';
import { ClientEntity } from 'src/user/domain/client.entity';
import { ClientOrderService } from '../order.external.client.service';
import { OrderStatus } from 'src/constants/orderStatus';

describe('ClientOrderService', () => {
  let service: ClientOrderService;
  let mockRestaurantService: Partial<RestaurantService>;
  let mockOrderCmdRepo: Partial<IOrderCommandRepository>;
  let mockOrderQryRepo: Partial<IOrderQueryRepository>;

  const customer = {
    id: 'cust-1',
    idMatches: jest.fn((id) => id === 'cust-1'),
  } as unknown as ClientEntity;

  beforeEach(() => {
    mockRestaurantService = {
      _validateRestaurantExistsOrThrow: jest.fn(),
    };
    mockOrderCmdRepo = {
      save: jest.fn(),
    };
    mockOrderQryRepo = {
      findSummaryForClient: jest.fn(),
      findDeliveredOrdersForCustomer: jest.fn(),
      findOnGoingOrderForClient: jest.fn(),
    };

    service = new ClientOrderService(
      mockRestaurantService as RestaurantService,
      mockOrderCmdRepo as IOrderCommandRepository,
      mockOrderQryRepo as IOrderQueryRepository,
    );
  });

  describe('createOrder', () => {
    it('should call restaurantService and save to command repo', async () => {
      const input: CreateOrderInput = {
        restaurantId: 'rest-1',
      };

      await service.createOrder(customer, input);

      expect(
        mockRestaurantService._validateRestaurantExistsOrThrow,
      ).toHaveBeenCalledWith('rest-1');
      expect(mockOrderCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('getOrderSummaryForClient', () => {
    it('should return summary if order exists and belongs to client', async () => {
      const projection: ClientOrderSummaryProjection = {
        id: 'order-1',
        status: OrderStatus.Delivered,
        deliveryAddress: '123 Street',
        customerId: 'cust-1',
        restaurantId: 'rest-1',
        restaurantName: 'Pizza Place',
      };
      mockOrderQryRepo.findSummaryForClient = jest
        .fn()
        .mockResolvedValue(projection);

      const result = await service.getOrderSummaryForClient(
        customer,
        'order-1',
      );

      expect(result).toEqual(projection);
    });

    it('should throw NotFoundException if order does not exist', async () => {
      mockOrderQryRepo.findSummaryForClient = jest.fn().mockResolvedValue(null);

      await expect(
        service.getOrderSummaryForClient(customer, 'order-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if order belongs to another customer', async () => {
      const projection = {
        id: 'order-1',
        customerId: 'someone-else',
      } as ClientOrderSummaryProjection;
      mockOrderQryRepo.findSummaryForClient = jest
        .fn()
        .mockResolvedValue(projection);
      customer.idMatches = jest.fn().mockReturnValue(false);

      await expect(
        service.getOrderSummaryForClient(customer, 'order-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getOrderHistory', () => {
    it('should return list of delivered orders', async () => {
      const history: ClientOrderPreviewProjection[] = [
        {
          id: 'order-1',
          status: OrderStatus.Delivered,
          deliveryAddress: '123 Street',
          customerId: 'cust-1',
          restaurantId: 'rest-1',
          restaurantName: 'Pizza Place',
        },
      ];

      mockOrderQryRepo.findDeliveredOrdersForCustomer = jest
        .fn()
        .mockResolvedValue(history);

      const result = await service.getOrderHistory(customer);
      expect(result).toEqual(history);
    });
  });

  describe('getOnGoingOrder', () => {
    it('should return ongoing order if found', async () => {
      const summary: ClientOrderSummaryProjection = {
        id: 'order-ongoing',
        status: OrderStatus.Accepted,
        deliveryAddress: '456 Avenue',
        customerId: 'cust-1',
        restaurantId: 'rest-1',
        restaurantName: 'Burger Joint',
      };

      mockOrderQryRepo.findOnGoingOrderForClient = jest
        .fn()
        .mockResolvedValue(summary);

      const result = await service.getOnGoingOrder(customer);
      expect(result).toEqual(summary);
    });

    it('should throw NotFoundException if no ongoing order exists', async () => {
      mockOrderQryRepo.findOnGoingOrderForClient = jest
        .fn()
        .mockResolvedValue(null);

      await expect(service.getOnGoingOrder(customer)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
