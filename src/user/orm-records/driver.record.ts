import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserRecord } from './user.record';
import { OrderRecord } from 'src/order/orm-records/order.record';

@Entity('driver')
export class DriverRecord {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => UserRecord, (user) => user.driver, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserRecord;

  @ManyToMany(() => OrderRecord, (order) => order.rejectedDrivers)
  rejectedOrders: OrderRecord[];

  @OneToMany(() => OrderRecord, (order) => order.driver)
  assignedOrders: OrderRecord[];
}
