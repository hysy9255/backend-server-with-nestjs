import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/domain/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@ObjectType()
@Entity()
@Unique(['owner'])
export class Restaurant {
  @Field(() => String)
  @PrimaryColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  address: string;

  @Field(() => String)
  @Column()
  category: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ownerId' }) // creates `ownerId` column in Restaurant
  owner: User;

  constructor(name: string, address: string, category: string) {
    this.id = uuidv4();
    this.name = name;
    this.address = address;
    this.category = category;
  }
}
