import { Entity, PrimaryColumn } from 'typeorm';

@Entity('order_rejected_driver')
export class OrderRejectedDriverRecord {
  @PrimaryColumn()
  orderId: string;

  @PrimaryColumn()
  driverId: string;
}
