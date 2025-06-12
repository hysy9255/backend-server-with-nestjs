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

@Entity('driver')
export class DriverOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => UserOrmEntity, (user) => user.driver, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @OneToMany(() => OrderOrmEntity, (order) => order.driver)
  orders: OrderOrmEntity[];
}
