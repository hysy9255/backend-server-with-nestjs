import { Field, ObjectType } from '@nestjs/graphql';
import { OrderRecord } from 'src/order/orm-records/order.record';
import { OwnerRecord } from 'src/user/orm-records/owner.record';

import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

// @ObjectType()
@Entity('restaurant')
@Unique(['ownerId'])
export class RestaurantRecord {
  // @Field(() => String)
  @PrimaryColumn('uuid')
  id: string;

  // @Field(() => String)
  @Column()
  name: string;

  // @Field(() => String)
  @Column()
  address: string;

  // @Field(() => String)
  @Column()
  category: string;

  @Column()
  ownerId: string;

  @OneToOne(() => OwnerRecord)
  @JoinColumn({ name: 'ownerId' }) // creates `ownerId` column in Restaurant
  owner: OwnerRecord;

  @OneToMany(() => OrderRecord, (order) => order.restaurant)
  orders: OrderRecord[];
}
