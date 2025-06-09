import { Field, ObjectType } from '@nestjs/graphql';
import { RestaurantRecord } from 'src/restaurant/orm-entities/restaurant.orm.entity';
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

  @ManyToOne(() => RestaurantRecord)
  @JoinColumn({ name: 'restaurantId' }) // creates `restaurantId` column in Dish
  restaurant: RestaurantRecord;

  constructor(name: string, price: string) {
    this.id = uuidv4();
    this.name = name;
    this.price = price;
  }
}
