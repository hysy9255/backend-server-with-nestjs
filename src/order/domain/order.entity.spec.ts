import { OrderEntity } from './order.entity';
import { OrderStatus } from 'src/constants/orderStatus';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('OrderEntity', () => {
  const restaurantId = 'resto-1';
  const customerId = 'cust-1';
  const driverId = 'driver-1';
  const anotherDriverId = 'driver-2';

  const mockCustomer = { id: customerId } as CustomerEntity;
  const mockDriver = { id: driverId } as DriverEntity;
  const anotherDriver = { id: anotherDriverId } as DriverEntity;

  let order: OrderEntity;

  beforeEach(() => {
    order = OrderEntity.createNew(restaurantId, customerId);
  });

  describe('createNew', () => {
    it('should create a pending order with valid fields', () => {
      expect(order.status).toBe(OrderStatus.Pending);
      expect(order.restaurantId).toBe(restaurantId);
      expect(order.customerId).toBe(customerId);
    });
  });

  describe('fromPersistance', () => {
    it('should recreate an order with all values including driverId and rejectedDriverIds', () => {
      const id = 'order-123';
      const status = OrderStatus.Ready;
      const driverId = 'driver-789';
      const rejectedDriverIds = ['driver-1', 'driver-2'];

      const order = OrderEntity.fromPersistance(
        id,
        status,
        restaurantId,
        customerId,
        driverId,
        rejectedDriverIds,
      );

      expect(order.id).toBe(id);
      expect(order.status).toBe(status);
      expect(order.restaurantId).toBe(restaurantId);
      expect(order.customerId).toBe(customerId);
      expect(order.driverId).toBe(driverId);
      expect(order.rejectedDriverIds).toEqual(rejectedDriverIds);
    });

    it('should recreate an order without optional values', () => {
      const id = 'order-456';
      const status = OrderStatus.Pending;

      const order = OrderEntity.fromPersistance(
        id,
        status,
        restaurantId,
        customerId,
      );

      expect(order.id).toBe(id);
      expect(order.status).toBe(status);
      expect(order.restaurantId).toBe(restaurantId);
      expect(order.customerId).toBe(customerId);
      expect(order.driverId).toBeUndefined();
      expect(order.rejectedDriverIds).toEqual([]);
    });
  });

  describe('isOwnedBy', () => {
    it('should return true if customer owns the order', () => {
      expect(order.isOwnedBy(mockCustomer)).toBe(true);
    });
  });

  describe('markAccepted', () => {
    it('should transition from Pending to Accepted', () => {
      order.markAccepted();
      expect(order.status).toBe(OrderStatus.Accepted);
    });

    it('should throw Conflict if already accepted', () => {
      order.markAccepted();
      expect(() => order.markAccepted()).toThrow(ConflictException);
    });

    it('should throw BadRequest if status is not Pending', () => {
      order.markRejected();
      expect(() => order.markAccepted()).toThrow(BadRequestException);
    });
  });

  describe('markRejected', () => {
    it('should transition from Pending to Rejected', () => {
      order.markRejected();
      expect(order.status).toBe(OrderStatus.Rejected);
    });

    it('should throw Conflict if already rejected', () => {
      order.markRejected();
      expect(() => order.markRejected()).toThrow(ConflictException);
    });

    it('should throw BadRequest if status is not Pending', () => {
      order.markAccepted();
      expect(() => order.markRejected()).toThrow(BadRequestException);
    });
  });

  describe('markReady', () => {
    it('should mark order as Ready if it was Accepted', () => {
      order.markAccepted();
      order.markReady();
      expect(order.status).toBe(OrderStatus.Ready);
    });

    it('should throw Conflict if already Ready', () => {
      order.markAccepted();
      order.markReady();
      expect(() => order.markReady()).toThrow(ConflictException);
    });

    it('should throw BadRequest if not Accepted', () => {
      expect(() => order.markReady()).toThrow(BadRequestException);
    });
  });

  describe('assignDriver', () => {
    it('should assign a driver if order is Accepted or Ready and no driver yet', () => {
      order.markAccepted();
      order.assignDriver(mockDriver);
      expect(order.driverId).toBe(driverId);
    });

    it('should throw BadRequest if order not Accepted or Ready', () => {
      expect(() => order.assignDriver(mockDriver)).toThrow(BadRequestException);
    });

    it('should throw Conflict if driver already rejected', () => {
      order.markAccepted();
      order.markRejectedByDriver(mockDriver);
      expect(() => order.assignDriver(mockDriver)).toThrow(ConflictException);
    });

    it('should throw Conflict if same driver already assigned', () => {
      order.markAccepted();
      order.assignDriver(mockDriver);
      expect(() => order.assignDriver(mockDriver)).toThrow(ConflictException);
    });

    it('should throw Conflict if another driver is already assigned', () => {
      order.markAccepted();
      order.assignDriver(mockDriver);
      expect(() => order.assignDriver(anotherDriver)).toThrow(
        ConflictException,
      );
    });
  });

  describe('markRejectedByDriver', () => {
    it('should add driverId to rejected list if valid', () => {
      order.markAccepted();
      order.markRejectedByDriver(mockDriver);
      expect(order.rejectedDriverIds).toContain(driverId);
    });

    it('should throw if order is not Accepted or Ready', () => {
      expect(() => order.markRejectedByDriver(mockDriver)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if driver is already assigned', () => {
      order.markAccepted();
      order.assignDriver(mockDriver);
      expect(() => order.markRejectedByDriver(mockDriver)).toThrow(
        ConflictException,
      );
    });

    it('should throw if driver already rejected', () => {
      order.markAccepted();
      order.markRejectedByDriver(mockDriver);
      expect(() => order.markRejectedByDriver(mockDriver)).toThrow(
        ConflictException,
      );
    });
  });

  describe('markPickedUp', () => {
    it('should change status to PickedUp if assigned and Ready', () => {
      order.markAccepted();
      order.markReady();
      order.assignDriver(mockDriver);
      order.markPickedUp(mockDriver);
      expect(order.status).toBe(OrderStatus.PickedUp);
    });

    it('should throw if not Ready', () => {
      order.markAccepted();
      order.assignDriver(mockDriver);
      expect(() => order.markPickedUp(mockDriver)).toThrow(BadRequestException);
    });

    it('should throw if wrong driver', () => {
      order.markAccepted();
      order.markReady();
      order.assignDriver(mockDriver);
      expect(() => order.markPickedUp(anotherDriver)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('markDelivered', () => {
    it('should mark as Delivered if PickedUp and same driver', () => {
      order.markAccepted();
      order.markReady();
      order.assignDriver(mockDriver);
      order.markPickedUp(mockDriver);
      order.markDelivered(mockDriver);
      expect(order.status).toBe(OrderStatus.Delivered);
    });

    it('should throw if not PickedUp', () => {
      order.markAccepted();
      order.markReady();
      order.assignDriver(mockDriver);
      expect(() => order.markDelivered(mockDriver)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if wrong driver', () => {
      order.markAccepted();
      order.markReady();
      order.assignDriver(mockDriver);
      order.markPickedUp(mockDriver);
      expect(() => order.markDelivered(anotherDriver)).toThrow(
        BadRequestException,
      );
    });
  });
});

// import { OrderStatus } from 'src/constants/orderStatus';
// import { Order } from './order.entity';
// import { User } from 'src/user/domain/user.entity';
// import { UserRole } from 'src/constants/userRole';
// import { Restaurant } from 'src/restaurant/domain/restaurant.entity';

// describe('Order Entity', () => {
//   const customer = new User('test', '1234', UserRole.Client);
//   const restaurant = new Restaurant('Test Restaurant', '123 Test St', 'cafe');

//   describe('markAccepted', () => {
//     it('should change status to Accepted', () => {
//       // given

//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Pending;

//       // when
//       order.markAccepted();

//       // then
//       expect(order.status).toBe(OrderStatus.Accepted);
//     });

//     it('should throw error if status is not Pending', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Delivered;

//       // when + then
//       expect(() => order.markAccepted()).toThrow(
//         'Order is not in a state to be accepted',
//       );
//     });
//   });

//   describe('markRejected', () => {
//     it('should change status to Rejected', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Pending;

//       // when
//       order.markRejected();

//       // then
//       expect(order.status).toBe(OrderStatus.Rejected);
//     });

//     it('should throw error if status is not Pending', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Delivered;

//       // when + then
//       expect(() => order.markRejected()).toThrow(
//         'Order is not in a state to be rejected',
//       );
//     });
//   });

//   describe('markReady', () => {
//     it('should change status to Ready', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Accepted;

//       // when
//       order.markReady();

//       // then
//       expect(order.status).toBe(OrderStatus.Ready);
//     });
//     it('should throw error if status is not Accepted', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Pending;

//       // when + then
//       expect(() => order.markReady()).toThrow(
//         'Order is not in a state to be marked as ready',
//       );
//     });
//   });

//   describe('assignDriver', () => {
//     it('should assign driver to order', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Accepted;
//       const driver = new User('driver', '1234', UserRole.Delivery);

//       // when
//       order.assignDriver(driver);

//       // then
//       expect(order.driver).toBe(driver);
//     });

//     it('should throw error if driver is already assigned', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Accepted;
//       const driver = new User('driver', '1234', UserRole.Delivery);
//       order.assignDriver(driver);

//       // when + then
//       expect(() => order.assignDriver(driver)).toThrow(
//         'Driver is already assigned to this order',
//       );
//     });

//     it('should throw error if status is not Accepted or Ready', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Pending;
//       const driver = new User('driver', '1234', UserRole.Delivery);

//       // when + then
//       expect(() => order.assignDriver(driver)).toThrow(
//         'Driver can only be assigned to an accepted or ready order',
//       );
//     });
//   });

//   describe('markRejectedByDriver', () => {
//     // it('should add driver to rejectedByDrivers', () => {
//     //   // given
//     //   const order = new Order(customer, restaurant);
//     //   order.status = OrderStatus.Accepted;
//     //   const driver = new User('driver', '1234', UserRole.Delivery);

//     //   // when
//     //   order.markRejectedByDriver(driver);

//     //   // then
//     //   expect(order.rejectedByDrivers).toContain(driver);
//     // });

//     it('should throw error if status is not Accepted or Ready', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Pending;
//       const driver = new User('driver', '1234', UserRole.Delivery);

//       // when + then
//       expect(() => order.markRejectedByDriver(driver)).toThrow(
//         'Order is not in a state to be rejected by driver',
//       );
//     });
//   });

//   describe('markPickedUp', () => {
//     it('should change status to PickedUp', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Ready;
//       const driver = new User('driver', '1234', UserRole.Delivery);
//       order.assignDriver(driver);
//       // console.log(order);

//       // when
//       order.markPickedUp(driver);

//       // then
//       expect(order.status).toBe(OrderStatus.PickedUp);
//     });

//     it('should throw error if driver is not assigned', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Ready;
//       const driver = new User('driver', '1234', UserRole.Delivery);

//       // when + then
//       expect(() => order.markPickedUp(driver)).toThrow(
//         'Only the assigned driver can pick up this order',
//       );
//     });

//     it('should throw error if status is not Ready', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Accepted;
//       const driver = new User('driver', '1234', UserRole.Delivery);
//       order.assignDriver(driver);

//       // when + then
//       expect(() => order.markPickedUp(driver)).toThrow(
//         'Order is not in a state to be picked up',
//       );
//     });
//   });

//   describe('markDelivered', () => {
//     it('should change status to Delivered', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Ready;
//       const driver = new User('driver', '1234', UserRole.Delivery);
//       order.assignDriver(driver);
//       order.status = OrderStatus.PickedUp;

//       // when
//       order.markDelivered(driver);

//       // then
//       expect(order.status).toBe(OrderStatus.Delivered);
//     });
//     it('should throw error if driver is not assigned', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Ready;
//       const driver = new User('driver', '1234', UserRole.Delivery);

//       // when + then
//       expect(() => order.markDelivered(driver)).toThrow(
//         'Only the assigned driver can deliver this order',
//       );
//     });
//     it('should throw error if status is not PickedUp', () => {
//       // given
//       const order = new Order(customer, restaurant);
//       order.status = OrderStatus.Ready;
//       const driver = new User('driver', '1234', UserRole.Delivery);
//       order.assignDriver(driver);

//       // when + then
//       expect(() => order.markDelivered(driver)).toThrow(
//         'Order is not in a state to be delivered',
//       );
//     });
//   });
// });
