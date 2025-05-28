import { Field, ObjectType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';
import { UserRole } from 'src/constants/userRole';
import { Restaurant } from 'src/restaurant/domain/restaurant.entity';
import { User } from 'src/user/domain/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './orderItem.entity';

@ObjectType()
@Entity()
export class Order {
  @Field(() => String)
  @PrimaryColumn('uuid')
  id: string;

  @Field(() => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Field(() => Boolean)
  get driverAssigned(): boolean {
    return !!this.driver;
  }

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  driver: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  customer: User;

  @ManyToMany(() => User, (user) => user.rejectedOrders)
  @JoinTable()
  rejectedByDrivers: User[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  constructor(customer: User, restaurant: Restaurant) {
    this.id = uuidv4();
    this.status = OrderStatus.Pending;
    this.customer = customer;
    this.restaurant = restaurant;
  }

  markAccepted() {
    if (this.status !== OrderStatus.Pending) {
      throw new Error('Order is not in a state to be accepted');
    }
    this.status = OrderStatus.Accepted;
  }

  markRejected() {
    if (this.status !== OrderStatus.Pending) {
      throw new Error('Order is not in a state to be rejected');
    }
    this.status = OrderStatus.Rejected;
  }

  markReady() {
    if (this.status !== OrderStatus.Accepted) {
      throw new Error('Order is not in a state to be marked as ready');
    }
    this.status = OrderStatus.Ready;
  }

  assignDriver(driver: User) {
    if (
      this.status !== OrderStatus.Accepted &&
      this.status !== OrderStatus.Ready
    ) {
      throw new Error(
        'Driver can only be assigned to an accepted or ready order',
      );
    }
    if (this.driver) {
      throw new Error('Driver is already assigned to this order');
    }
    this.driver = driver;
  }

  markRejectedByDriver(driver: User) {
    if (
      this.status !== OrderStatus.Accepted &&
      this.status !== OrderStatus.Ready
    ) {
      throw new Error('Order is not in a state to be rejected by driver');
    }

    if (!this.rejectedByDrivers) {
      this.rejectedByDrivers = [];
    }

    this.rejectedByDrivers.push(driver);
  }

  markPickedUp(driver: User) {
    if (!this.driver || this.driver.id !== driver.id) {
      throw new Error('Only the assigned driver can pick up this order');
    }
    if (this.status !== OrderStatus.Ready) {
      throw new Error('Order is not in a state to be picked up');
    }
    this.status = OrderStatus.PickedUp;
  }

  markDelivered(driver: User) {
    if (!this.driver || this.driver.id !== driver.id) {
      throw new Error('Only the assigned driver can deliver this order');
    }
    if (this.status !== OrderStatus.PickedUp) {
      throw new Error('Order is not in a state to be delivered');
    }
    this.status = OrderStatus.Delivered;
  }
}
