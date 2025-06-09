import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm.entity';
import { OrderOrmEntity } from 'src/order/orm-entities/order.orm.entity';

@Entity('customer')
export class CustomerOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  deliveryAddress: string;

  @Column()
  userId: string;

  @OneToOne(() => UserOrmEntity, (user) => user.customer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @OneToMany(() => OrderOrmEntity, (order) => order.customer)
  orders: OrderOrmEntity[];
}
