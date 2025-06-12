import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserOrmEntity } from './user.orm.entity';
import { RestaurantOrmEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm.entity';

@Entity('owner')
export class OwnerOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => UserOrmEntity, (user) => user.owner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @OneToOne(() => RestaurantOrmEntity, (restaurant) => restaurant.owner)
  restaurant?: RestaurantOrmEntity;
}
