import { Field, ObjectType } from '@nestjs/graphql';
import { Restaurant } from 'src/restaurant/orm-records/restaurant.record';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@ObjectType()
@Entity()
export class Dish {
  @Field(() => String)
  @PrimaryColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  price: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurantId' }) // creates `restaurantId` column in Dish
  restaurant: Restaurant;

  constructor(name: string, price: string) {
    this.id = uuidv4();
    this.name = name;
    this.price = price;
  }
}
