import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRecord } from './user.record';
import { RestaurantRecord } from 'src/restaurant/orm-records/restaurant.record';

@Entity()
export class OwnerRecord {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => UserRecord, (user) => user.owner)
  @JoinColumn({ name: 'userId' })
  user: UserRecord;

  @OneToOne(() => RestaurantRecord, (restaurant) => restaurant.owner)
  restaurant?: RestaurantRecord;
}
