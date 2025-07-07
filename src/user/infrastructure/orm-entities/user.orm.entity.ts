import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRole } from 'src/constants/userRole';
import { DriverOrmEntity } from './driver.orm.entity';
import { OwnerOrmEntity } from './owner.orm.entity';
import { ClientOrmEntity } from './client.orm.entity';

@Entity('user')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToOne(() => OwnerOrmEntity, (owner) => owner.user)
  owner: OwnerOrmEntity;

  @OneToOne(() => ClientOrmEntity, (owner) => owner.user)
  client: ClientOrmEntity;

  @OneToOne(() => DriverOrmEntity, (owner) => owner.user)
  driver: DriverOrmEntity;
}
