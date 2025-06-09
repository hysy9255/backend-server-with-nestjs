import { DriverOrmEntity } from 'src/user/orm-entities/driver.orm.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderOrmEntity } from './order.orm.entity';
import { OwnerOrmEntity } from 'src/user/orm-entities/owner.orm.entity';

@Entity('order_owner_rejection')
export class OrderOwnerRejectionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @Column()
  orderId: string;

  @ManyToOne(() => OwnerOrmEntity)
  @JoinColumn({ name: 'ownerId' })
  owner: OwnerOrmEntity;

  @ManyToOne(() => OrderOrmEntity)
  @JoinColumn({ name: 'orderId' })
  order: OrderOrmEntity;
}
