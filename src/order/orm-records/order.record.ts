import { Field, ObjectType } from '@nestjs/graphql';
import { OrderStatus } from 'src/constants/orderStatus';

import {
  Column,
  Entity,
  JoinColumn,
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
import { CustomerRecord } from 'src/user/orm-records/customer.record';
import { DriverRecord } from 'src/user/orm-records/driver.record';

@Entity('order')
export class OrderRecord {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Column()
  customerId: string;

  @Column()
  driverId: string;

  @Column()
  restaurantId: string;

  // @ManyToOne(() => CustomerRecord, (customer) => customer.orders, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'customerId' })
  // customer: CustomerRecord;

  // @ManyToOne(() => DriverRecord, (driver) => driver.assignedOrders, {
  //   onDelete: 'CASCADE',
  // })
  // driver?: DriverRecord | null;

  // @ManyToOne(() => RestaurantRecord, (restaurant) => restaurant.orders, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'restaurantId' })
  // restaurant: RestaurantRecord;

  // @ManyToMany(() => DriverRecord, (user) => user.rejectedOrders)
  // @JoinTable()
  // rejectedDrivers: DriverRecord[];
}
