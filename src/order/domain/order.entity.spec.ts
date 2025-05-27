import { OrderStatus } from 'src/constants/orderStatus';
import { Order } from './order.entity';
import { User } from 'src/user/domain/user.entity';
import { UserRole } from 'src/constants/userRole';
import { Restaurant } from 'src/restaurant/domain/restaurant.entity';

describe('Order Entity', () => {
  const customer = new User('test', '1234', UserRole.Client);
  const restaurant = new Restaurant('Test Restaurant', '123 Test St', 'cafe');

  describe('markAccepted', () => {
    it('should change status to Accepted', () => {
      // given

      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Pending;

      // when
      order.markAccepted();

      // then
      expect(order.status).toBe(OrderStatus.Accepted);
    });

    it('should throw error if status is not Pending', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Delivered;

      // when + then
      expect(() => order.markAccepted()).toThrow(
        'Order is not in a state to be accepted',
      );
    });
  });

  describe('markRejected', () => {
    it('should change status to Rejected', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Pending;

      // when
      order.markRejected();

      // then
      expect(order.status).toBe(OrderStatus.Rejected);
    });

    it('should throw error if status is not Pending', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Delivered;

      // when + then
      expect(() => order.markRejected()).toThrow(
        'Order is not in a state to be rejected',
      );
    });
  });

  describe('markReady', () => {
    it('should change status to Ready', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Accepted;

      // when
      order.markReady();

      // then
      expect(order.status).toBe(OrderStatus.Ready);
    });
    it('should throw error if status is not Accepted', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Pending;

      // when + then
      expect(() => order.markReady()).toThrow(
        'Order is not in a state to be marked as ready',
      );
    });
  });

  describe('assignDriver', () => {
    it('should assign driver to order', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Accepted;
      const driver = new User('driver', '1234', UserRole.Delivery);

      // when
      order.assignDriver(driver);

      // then
      expect(order.driver).toBe(driver);
    });

    it('should throw error if driver is already assigned', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Accepted;
      const driver = new User('driver', '1234', UserRole.Delivery);
      order.assignDriver(driver);

      // when + then
      expect(() => order.assignDriver(driver)).toThrow(
        'Driver is already assigned to this order',
      );
    });

    it('should throw error if status is not Accepted or Ready', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Pending;
      const driver = new User('driver', '1234', UserRole.Delivery);

      // when + then
      expect(() => order.assignDriver(driver)).toThrow(
        'Driver can only be assigned to an accepted or ready order',
      );
    });
  });

  describe('markRejectedByDriver', () => {
    // it('should add driver to rejectedByDrivers', () => {
    //   // given
    //   const order = new Order(customer, restaurant);
    //   order.status = OrderStatus.Accepted;
    //   const driver = new User('driver', '1234', UserRole.Delivery);

    //   // when
    //   order.markRejectedByDriver(driver);

    //   // then
    //   expect(order.rejectedByDrivers).toContain(driver);
    // });

    it('should throw error if status is not Accepted or Ready', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Pending;
      const driver = new User('driver', '1234', UserRole.Delivery);

      // when + then
      expect(() => order.markRejectedByDriver(driver)).toThrow(
        'Order is not in a state to be rejected by driver',
      );
    });
  });

  describe('markPickedUp', () => {
    it('should change status to PickedUp', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Ready;
      const driver = new User('driver', '1234', UserRole.Delivery);
      order.assignDriver(driver);
      // console.log(order);

      // when
      order.markPickedUp(driver);

      // then
      expect(order.status).toBe(OrderStatus.PickedUp);
    });

    it('should throw error if driver is not assigned', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Ready;
      const driver = new User('driver', '1234', UserRole.Delivery);

      // when + then
      expect(() => order.markPickedUp(driver)).toThrow(
        'Only the assigned driver can pick up this order',
      );
    });

    it('should throw error if status is not Ready', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Accepted;
      const driver = new User('driver', '1234', UserRole.Delivery);
      order.assignDriver(driver);

      // when + then
      expect(() => order.markPickedUp(driver)).toThrow(
        'Order is not in a state to be picked up',
      );
    });
  });

  describe('markDelivered', () => {
    it('should change status to Delivered', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Ready;
      const driver = new User('driver', '1234', UserRole.Delivery);
      order.assignDriver(driver);
      order.status = OrderStatus.PickedUp;

      // when
      order.markDelivered(driver);

      // then
      expect(order.status).toBe(OrderStatus.Delivered);
    });
    it('should throw error if driver is not assigned', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Ready;
      const driver = new User('driver', '1234', UserRole.Delivery);

      // when + then
      expect(() => order.markDelivered(driver)).toThrow(
        'Only the assigned driver can deliver this order',
      );
    });
    it('should throw error if status is not PickedUp', () => {
      // given
      const order = new Order(customer, restaurant);
      order.status = OrderStatus.Ready;
      const driver = new User('driver', '1234', UserRole.Delivery);
      order.assignDriver(driver);

      // when + then
      expect(() => order.markDelivered(driver)).toThrow(
        'Order is not in a state to be delivered',
      );
    });
  });
});
