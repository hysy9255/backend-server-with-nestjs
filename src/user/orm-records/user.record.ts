import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/constants/userRole';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { RestaurantRecord } from 'src/restaurant/orm-records/restaurant.record';
import { OrderRecord } from 'src/order/orm-records/order.record';

@Entity()
export class UserRecord {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  // @OneToOne(() => RestaurantRecord, (restaurant) => restaurant.owner)
  // restaurant?: RestaurantRecord;

  // @OneToMany(() => OrderRecord, (order) => order.customer)
  // orders?: OrderRecord[];

  // @ManyToMany(() => OrderRecord, (order) => order.rejectedDrivers)
  // rejectedOrders: OrderRecord[];

  @OneToOne(() => OwnerRecord, (owner) => owner.user)
  owner: OwnerRecord;

  @OneToOne(() => CustomerRecord, (owner) => owner.user)
  customer: CustomerRecord;

  @OneToOne(() => DriverRecord, (owner) => owner.user)
  driver: DriverRecord;
}

@Entity()
export class OwnerRecord {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => UserRecord, (user) => user.owner)
  @JoinColumn({ name: 'userId' })
  user: UserRecord;

  @OneToOne(() => RestaurantRecord, (restaurant) => restaurant.owner)
  restaurant?: RestaurantRecord;
}

@Entity()
export class CustomerRecord {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  deliveryAddress: string;

  @OneToOne(() => UserRecord, (user) => user.customer)
  @JoinColumn({ name: 'userId' })
  user: UserRecord;

  @OneToMany(() => OrderRecord, (order) => order.customer)
  orders: OrderRecord[];
}

@Entity()
export class DriverRecord {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => UserRecord, (user) => user.driver)
  @JoinColumn({ name: 'userId' })
  user: UserRecord;

  @ManyToMany(() => OrderRecord, (order) => order.rejectedDrivers)
  rejectedOrders: OrderRecord[];

  @OneToMany(() => OrderRecord, (order) => order.assignedDriver)
  assignedOrders: OrderRecord[];
}
