import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm.entity';
import { OrderOrmEntity } from 'src/order/infrastructure/orm-entities/order.orm.entity';

@Entity('client')
export class ClientOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  deliveryAddress: string;

  @Column()
  userId: string;

  @OneToOne(() => UserOrmEntity, (user) => user.client, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @OneToMany(() => OrderOrmEntity, (order) => order.client)
  orders: OrderOrmEntity[];
}
