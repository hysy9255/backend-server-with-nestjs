import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserRecord } from './user.record';
import { OrderRecord } from 'src/order/orm-records/order.record';

@Entity()
export class DriverRecord {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => UserRecord, (user) => user.driver)
  @JoinColumn({ name: 'userId' })
  user: UserRecord;

  @ManyToMany(() => OrderRecord, (order) => order.rejectedDrivers)
  rejectedOrders: OrderRecord[];

  @OneToMany(() => OrderRecord, (order) => order.driver)
  assignedOrders: OrderRecord[];
}
