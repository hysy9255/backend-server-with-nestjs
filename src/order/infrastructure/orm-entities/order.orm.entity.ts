import { OrderStatus } from 'src/constants/orderStatus';
import { RestaurantOrmEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm.entity';
import { CustomerOrmEntity } from 'src/user/infrastructure/orm-entities/customer.orm.entity';
import { DriverOrmEntity } from 'src/user/infrastructure/orm-entities/driver.orm.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('order')
export class OrderOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  driverId?: string;

  @Column()
  restaurantId: string;

  @ManyToOne(() => CustomerOrmEntity, (customer) => customer.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerOrmEntity;

  @ManyToOne(() => RestaurantOrmEntity, (restaurant) => restaurant.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantOrmEntity;

  @ManyToOne(() => DriverOrmEntity, (driver) => driver.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'driverId' })
  driver?: DriverOrmEntity;
}
