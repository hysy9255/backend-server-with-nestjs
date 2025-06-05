import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRecord } from './user.record';
import { RestaurantRecord } from 'src/restaurant/orm-records/restaurant.record';

@Entity('owner')
export class OwnerRecord {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => UserRecord, (user) => user.owner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserRecord;

  @Column({ nullable: true })
  restaurantId?: string | null;

  @OneToOne(() => RestaurantRecord, (restaurant) => restaurant.owner)
  @JoinColumn({ name: 'restaurantId' })
  restaurant?: RestaurantRecord;
}
