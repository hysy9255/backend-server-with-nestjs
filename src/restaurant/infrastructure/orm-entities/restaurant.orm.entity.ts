import { OrderOrmEntity } from 'src/order/infrastructure/orm-entities/order.orm.entity';
import { OwnerOrmEntity } from 'src/user/infrastructure/orm-entities/owner.orm.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity('restaurant')
@Unique(['ownerId'])
export class RestaurantOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  category: string;

  @Column()
  ownerId: string;

  @OneToOne(() => OwnerOrmEntity, (owner) => owner.restaurant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: OwnerOrmEntity;

  @OneToMany(() => OrderOrmEntity, (order) => order.restaurant)
  orders: OrderOrmEntity[];
}
