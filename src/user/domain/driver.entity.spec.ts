import { DriverEntity } from './driver.entity';
import { DriverOrderSummaryProjection } from 'src/order/infrastructure/repositories/query/projections/order.projection';
import { v4 as uuidv4 } from 'uuid';

describe('DriverEntity', () => {
  const userId = 'user-123';

  describe('createNew', () => {
    it('should create a new DriverEntity with a UUID', () => {
      const driver = DriverEntity.createNew(userId);
      expect(driver.id).toBeDefined();
      expect(driver.userId).toBe(userId);
    });
  });

  describe('fromPersistance', () => {
    it('should recreate DriverEntity from persisted values', () => {
      const id = uuidv4();
      const driver = DriverEntity.fromPersistance(id, userId);
      expect(driver.id).toBe(id);
      expect(driver.userId).toBe(userId);
    });
  });

  describe('canAccessOrderOf', () => {
    const driver = DriverEntity.createNew(userId);

    it('should return true if no driver is assigned to the order', () => {
      const order = { driverId: null } as DriverOrderSummaryProjection;
      expect(driver.canAccessOrderOf(order)).toBe(true);
    });

    it('should return true if order is assigned to this driver', () => {
      const order = { driverId: driver.id } as DriverOrderSummaryProjection;
      expect(driver.canAccessOrderOf(order)).toBe(true);
    });

    it('should return false if order is assigned to a different driver', () => {
      const order = {
        driverId: 'different-driver-id',
      } as DriverOrderSummaryProjection;
      expect(driver.canAccessOrderOf(order)).toBe(false);
    });
  });
});
