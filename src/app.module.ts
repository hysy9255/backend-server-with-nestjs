import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

import { JwtModule } from './jwt/jwt.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleWare } from './jwt/jwt.middleware';
import { RestaurantModule } from './restaurant/restaurant.module';

import { DishModule } from './dish/dish.module';
import { Dish } from './dish/domain/dish.entity';
import { OrderModule } from './order/order.module';

import { OrderItem } from './order/orm-records/orderItem.entity';
import { UserRecord } from './user/orm-records/user.record';
import { RestaurantRecord } from './restaurant/orm-records/restaurant.record';
import { OrderRecord } from './order/orm-records/order.record';
import { CustomerRecord } from './user/orm-records/customer.record';
import { DriverRecord } from './user/orm-records/driver.record';
import { OwnerRecord } from './user/orm-records/owner.record';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development.local'
          ? '.env.development.local'
          : '.env.production.local',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        UserRecord,
        OwnerRecord,
        CustomerRecord,
        DriverRecord,
        RestaurantRecord,
        Dish,
        OrderRecord,
        OrderItem,
      ],
      synchronize: true,
    }),
    UserModule,
    JwtModule,
    AuthModule,
    RestaurantModule,
    DishModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleWare)
      .forRoutes(
        { path: '/graphql', method: RequestMethod.POST },
        { path: '/api/*path', method: RequestMethod.ALL },
      );
  }
}
