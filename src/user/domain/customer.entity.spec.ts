import { CustomerEntity } from './customer.entity'; // adjust path if needed
import { v4 as uuidv4 } from 'uuid';

describe('CustomerEntity', () => {
  const userId = 'user-abc';
  const deliveryAddress = '123 Main Street';

  describe('createNew', () => {
    it('should create a new customer with generated id', () => {
      const customer = CustomerEntity.createNew(userId, deliveryAddress);

      expect(customer.id).toBeDefined();
      expect(customer.userId).toBe(userId);
      expect(customer.deliveryAddress).toBe(deliveryAddress);
      expect(customer.orders).toEqual([]);
    });
  });

  describe('fromPersistance', () => {
    it('should recreate customer with given id, userId, and address', () => {
      const id = uuidv4();
      const customer = CustomerEntity.fromPersistance(
        id,
        userId,
        deliveryAddress,
      );

      expect(customer.id).toBe(id);
      expect(customer.userId).toBe(userId);
      expect(customer.deliveryAddress).toBe(deliveryAddress);
      expect(customer.orders).toEqual([]); // still empty by default
    });
  });

  describe('idMatches', () => {
    it('should return true if id matches', () => {
      const customer = CustomerEntity.createNew(userId, deliveryAddress);
      expect(customer.idMatches(customer.id)).toBe(true);
    });

    it('should return false if id does not match', () => {
      const customer = CustomerEntity.createNew(userId, deliveryAddress);
      expect(customer.idMatches('some-other-id')).toBe(false);
    });
  });
});
