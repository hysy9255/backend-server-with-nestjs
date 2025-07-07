import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.external.service';
import { BadRequestException } from '@nestjs/common';
import { RESTAURANT_ERROR_MESSAGES } from 'src/constants/errorMessages';
import { RestaurantQueryProjection } from '../../infrastructure/repositories/query/retaurant-query.repository.interface';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { RestaurantRegistrationService } from '../../domain/restaurant-registration.service';
import { RestaurantMapper } from './mapper/restaurant.mapper';
import { CreateRestaurantInput } from 'src/restaurant/interface/dtos/restaurant-inputs.dto';
import { UserService } from 'src/user/application/service/user.external.service';

jest.mock('../../domain/restaurant-registration.service');
jest.mock('./mapper/restaurant.mapper');

describe('RestaurantService', () => {
  let service: RestaurantService;

  const mockRestaurantCmdRepo = {
    save: jest.fn(),
    findOneById: jest.fn(),
  };

  const mockRestaurantQryRepo = {
    findSummary: jest.fn(),
    findSummaries: jest.fn(),
  };

  const mockUserService = {
    updateOwner: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: 'IRestaurantCommandRepository',
          useValue: mockRestaurantCmdRepo,
        },
        {
          provide: 'IRestaurantQueryRepository',
          useValue: mockRestaurantQryRepo,
        },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRestaurant', () => {
    it('should create and save a restaurant and update owner', async () => {
      const owner = OwnerEntity.fromPersistance('owner-id', 'user-id');
      const input: CreateRestaurantInput = {
        name: 'My Restaurant',
        address: '123 Main St',
        category: 'Italian',
      };

      const domainRestaurant = { id: '123' }; // fake return from domain service
      const ormEntity = { id: '123' }; // fake orm entity

      (RestaurantRegistrationService.register as jest.Mock).mockReturnValue(
        domainRestaurant,
      );
      (RestaurantMapper.toOrmEntity as jest.Mock).mockReturnValue(ormEntity);

      await service.createRestaurant(owner, input);

      expect(RestaurantRegistrationService.register).toHaveBeenCalledWith(
        owner,
        input.name,
        input.address,
        input.category,
      );
      expect(RestaurantMapper.toOrmEntity).toHaveBeenCalledWith(
        domainRestaurant,
      );
      expect(mockRestaurantCmdRepo.save).toHaveBeenCalledWith(ormEntity);
      expect(mockUserService.updateOwner).toHaveBeenCalledWith(owner);
    });
  });

  describe('getRestaurantSummaryById', () => {
    it('should return restaurant summary when found', async () => {
      const summary: RestaurantQueryProjection = {
        id: '123',
        name: 'Test',
        category: 'Korean',
        address: 'Seoul',
      };
      mockRestaurantQryRepo.findSummary.mockResolvedValue(summary);

      const result = await service.getRestaurantSummaryById('123');
      expect(result).toBe(summary);
    });

    it('should throw BadRequestException if restaurant not found', async () => {
      mockRestaurantQryRepo.findSummary.mockResolvedValue(null);

      await expect(
        service.getRestaurantSummaryById('not-found'),
      ).rejects.toThrow(
        new BadRequestException(RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND),
      );
    });
  });

  describe('getRestaurantSummaries', () => {
    it('should return all restaurant summaries', async () => {
      const summaries = [{ id: '1', name: 'A', category: 'B', address: 'C' }];
      mockRestaurantQryRepo.findSummaries.mockResolvedValue(summaries);

      const result = await service.getRestaurantSummaries();
      expect(result).toEqual(summaries);
    });
  });

  describe('_validateRestaurantExistsOrThrow', () => {
    it('should not throw if restaurant exists', async () => {
      mockRestaurantCmdRepo.findOneById.mockResolvedValue({ id: 'exists' });

      await expect(
        service._validateRestaurantExistsOrThrow('exists'),
      ).resolves.not.toThrow();
    });

    it('should throw BadRequestException if not found', async () => {
      mockRestaurantCmdRepo.findOneById.mockResolvedValue(null);

      await expect(
        service._validateRestaurantExistsOrThrow('not-found'),
      ).rejects.toThrow(
        new BadRequestException(RESTAURANT_ERROR_MESSAGES.RESTAURANT_NOT_FOUND),
      );
    });
  });
});
