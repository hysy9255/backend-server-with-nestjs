import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRole } from 'src/constants/userRole';
import { OwnerRecord } from './owner.record';
import { CustomerRecord } from './customer.record';
import { DriverRecord } from './driver.record';

@Entity('user')
export class UserRecord {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToOne(() => OwnerRecord, (owner) => owner.user)
  owner: OwnerRecord;

  @OneToOne(() => CustomerRecord, (owner) => owner.user)
  customer: CustomerRecord;

  @OneToOne(() => DriverRecord, (owner) => owner.user)
  driver: DriverRecord;
}
