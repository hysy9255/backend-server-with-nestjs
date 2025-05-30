import { Field, ObjectType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';
import { UserRole } from 'src/constants/userRole';
import {
  CustomerRecord,
  DriverRecord,
  UserRecord,
} from 'src/user/orm-records/user.record';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './orderItem.entity';
import { RestaurantRecord } from 'src/restaurant/orm-records/restaurant.record';
import { UserEntity } from 'src/user/domain/user.entity';

@ObjectType()
@Entity()
export class OrderRecord {
  @Field(() => String)
  @PrimaryColumn('uuid')
  id: string;

  @Field(() => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  // @Field(() => Boolean)
  // get driverAssigned(): boolean {
  //   return !!this.driver;
  // }

  @ManyToOne(() => CustomerRecord, (customer) => customer.orders, {
    onDelete: 'CASCADE',
  })
  customer: CustomerRecord;

  // @ManyToOne(() => UserRecord, (user) => user.orders, {
  //   onDelete: 'CASCADE',
  // })
  // driver?: UserRecord | null;

  @ManyToOne(() => DriverRecord, (driver) => driver.assignedOrders, {
    onDelete: 'CASCADE',
  })
  assignedDriver?: DriverRecord | null;

  @ManyToOne(() => RestaurantRecord, (restaurant) => restaurant.orders, {
    onDelete: 'CASCADE',
  })
  restaurant: RestaurantRecord;

  // @ManyToOne(() => UserRecord, (user) => user.orders, {
  //   onDelete: 'CASCADE',
  // })
  // customer: UserRecord;

  @ManyToMany(() => DriverRecord, (user) => user.rejectedOrders)
  @JoinTable()
  rejectedDrivers: DriverRecord[];

  // @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  // orderItems: OrderItem[];

  // @OneToOne(() => OrderItem, (orderItem) => orderItem.order)
  // orderItem: OrderItem;

  // constructor(customer: User, restaurant: Restaurant) {
  //   this.id = uuidv4();
  //   this.status = OrderStatus.Pending;
  //   this.customer = customer;
  //   this.restaurant = restaurant;
  // }

  // markAccepted() {
  //   if (this.status !== OrderStatus.Pending) {
  //     throw new Error('Order is not in a state to be accepted');
  //   }
  //   this.status = OrderStatus.Accepted;
  // }

  // markRejected() {
  //   if (this.status !== OrderStatus.Pending) {
  //     throw new Error('Order is not in a state to be rejected');
  //   }
  //   this.status = OrderStatus.Rejected;
  // }

  // markReady() {
  //   if (this.status !== OrderStatus.Accepted) {
  //     throw new Error('Order is not in a state to be marked as ready');
  //   }
  //   this.status = OrderStatus.Ready;
  // }

  // assignDriver(driver: User) {
  //   if (
  //     this.status !== OrderStatus.Accepted &&
  //     this.status !== OrderStatus.Ready
  //   ) {
  //     throw new Error(
  //       'Driver can only be assigned to an accepted or ready order',
  //     );
  //   }
  //   if (this.driver) {
  //     throw new Error('Driver is already assigned to this order');
  //   }
  //   this.driver = driver;
  // }

  // markRejectedByDriver(driver: User) {
  //   if (
  //     this.status !== OrderStatus.Accepted &&
  //     this.status !== OrderStatus.Ready
  //   ) {
  //     throw new Error('Order is not in a state to be rejected by driver');
  //   }

  //   if (!this.rejectedByDrivers) {
  //     this.rejectedByDrivers = [];
  //   }

  //   this.rejectedByDrivers.push(driver);
  // }

  // markPickedUp(driver: User) {
  //   if (!this.driver || this.driver.id !== driver.id) {
  //     throw new Error('Only the assigned driver can pick up this order');
  //   }
  //   if (this.status !== OrderStatus.Ready) {
  //     throw new Error('Order is not in a state to be picked up');
  //   }
  //   this.status = OrderStatus.PickedUp;
  // }

  // markDelivered(driver: User) {
  //   if (!this.driver || this.driver.id !== driver.id) {
  //     throw new Error('Only the assigned driver can deliver this order');
  //   }
  //   if (this.status !== OrderStatus.PickedUp) {
  //     throw new Error('Order is not in a state to be delivered');
  //   }
  //   this.status = OrderStatus.Delivered;
  // }
}
