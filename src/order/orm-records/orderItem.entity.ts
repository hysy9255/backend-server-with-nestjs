import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.record';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class OrderItem {
  @PrimaryColumn('uuid')
  id: string;

  // @ManyToOne(() => Order, (order) => order.orderItems, {
  //   onDelete: 'CASCADE',
  // })
  // order: Order;

  // @OneToOne(() => Order, (order) => order.orderItem)
  // order: Order;

  constructor() {
    this.id = uuidv4();
  }
}
