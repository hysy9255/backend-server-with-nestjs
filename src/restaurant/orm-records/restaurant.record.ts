import { Field, ObjectType } from '@nestjs/graphql';
import { OrderRecord } from 'src/order/orm-records/order.record';

import { User } from 'src/user/orm-records/user.record';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@ObjectType()
@Entity()
@Unique(['owner'])
export class RestaurantRecord {
  @Field(() => String)
  @PrimaryColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  address: string;

  @Field(() => String)
  @Column()
  category: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ownerId' }) // creates `ownerId` column in Restaurant
  owner: User;

  @OneToMany(() => OrderRecord, (order) => order.restaurant)
  orders: OrderRecord[];

  // constructor(name: string, address: string, category: string) {
  //   this.id = uuidv4();
  //   this.name = name;
  //   this.address = address;
  //   this.category = category;
  // }
}
