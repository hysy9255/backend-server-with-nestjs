import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/constants/userRole';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { Restaurant } from 'src/restaurant/domain/restaurant.entity';
import { Order } from 'src/order/domain/order.entity';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.owner)
  restaurant?: Restaurant;

  @OneToMany(() => Order, (order) => order.customer)
  orders?: Order[];

  @ManyToMany(() => Order, (order) => order.rejectedByDrivers)
  rejectedOrders: Order[];

  constructor(email: string, password: string, role: UserRole) {
    this.id = uuidv4();
    this.email = email;
    this.password = password;
    this.role = role;
  }

  checkUserRole(role: UserRole): void {
    const matches = this.role === role;
    if (!matches) {
      throw new BadRequestException(ERROR_MESSAGES.USER_ROLE_MISMATCH);
    }
  }

  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.error(e);
        throw new InternalServerErrorException(ERROR_MESSAGES.HASH_FAILED);
      }
    }
  }

  async checkPassword(aPassword: string): Promise<void> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      if (!ok) {
        throw new BadRequestException(ERROR_MESSAGES.WRONG_PASSWORD);
      }
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e; // preserve known HTTP errors
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PASSWORD_CHECK_FAILED,
      );
    }
  }
}
