import { OwnerEntity } from './owner.entity';
import { OrderEntity } from 'src/order/domain/order.entity';
import { v4 as uuidv4 } from 'uuid';

describe('OwnerEntity', () => {
  const userId = 'user-123';
  const restaurantId = 'restaurant-456';
  const orderMock = {
    restaurantId,
  } as OrderEntity;

  describe('createNew', () => {
    it('should create a new owner with a UUID and no restaurant assigned', () => {
      const owner = OwnerEntity.createNew(userId);
      expect(owner.id).toBeDefined();
      expect(owner.userId).toBe(userId);
      expect(owner.restaurantId).toBeUndefined();
      expect(owner.hasRestaurant()).toBe(false);
    });
  });

  describe('fromPersistance', () => {
    it('should create an OwnerEntity with all values from persistence', () => {
      const id = uuidv4();
      const owner = OwnerEntity.fromPersistance(id, userId, restaurantId);
      expect(owner.id).toBe(id);
      expect(owner.userId).toBe(userId);
      expect(owner.restaurantId).toBe(restaurantId);
      expect(owner.hasRestaurant()).toBe(true);
    });
  });

  describe('assignRestaurant', () => {
    it('should assign a restaurant to the owner', () => {
      const owner = OwnerEntity.createNew(userId);
      owner.assignRestaurant(restaurantId);
      expect(owner.restaurantId).toBe(restaurantId);
      expect(owner.hasRestaurant()).toBe(true);
    });
  });

  describe('ownsRestaurantOf', () => {
    it('should return true if owner owns the restaurant', () => {
      const owner = OwnerEntity.fromPersistance('id', userId, restaurantId);
      expect(owner.ownsRestaurantOf(restaurantId)).toBe(true);
    });

    it('should return false if owner does not own the restaurant', () => {
      const owner = OwnerEntity.fromPersistance('id', userId, 'different-id');
      expect(owner.ownsRestaurantOf(restaurantId)).toBe(false);
    });
  });

  describe('canAccessOrderOf', () => {
    it("should return true if order belongs to the owner's restaurant", () => {
      const owner = OwnerEntity.fromPersistance('id', userId, restaurantId);
      expect(owner.canAccessOrderOf(orderMock)).toBe(true);
    });

    it("should return false if order does not belong to owner's restaurant", () => {
      const owner = OwnerEntity.fromPersistance('id', userId, 'other-id');
      expect(owner.canAccessOrderOf(orderMock)).toBe(false);
    });
  });
});
