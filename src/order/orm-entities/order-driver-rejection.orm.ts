import { DriverOrmEntity } from 'src/user/orm-entities/driver.orm.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderOrmEntity } from './order.orm.entity';

@Entity('order_driver_rejection')
export class OrderDriverRejectionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  driverId: string;

  @Column()
  orderId: string;

  @ManyToOne(() => DriverOrmEntity)
  @JoinColumn({ name: 'driverId' })
  driver: DriverOrmEntity;

  @ManyToOne(() => OrderOrmEntity)
  @JoinColumn({ name: 'orderId' })
  order: OrderOrmEntity;
}
