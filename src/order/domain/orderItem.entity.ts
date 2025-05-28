import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class OrderItem {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  constructor() {
    this.id = uuidv4();
  }
}
