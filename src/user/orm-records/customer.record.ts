import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserRecord } from './user.record';
import { OrderRecord } from 'src/order/orm-records/order.record';

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
