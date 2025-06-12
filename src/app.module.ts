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
import { OrderModule } from './order/order.module';
import { OrderOrmEntity } from './order/infrastructure/orm-entities/order.orm.entity';
import { OrderDriverRejectionOrmEntity } from './order/infrastructure/orm-entities/order-driver-rejection.orm';
import { RestaurantOrmEntity } from './restaurant/infrastructure/orm-entities/restaurant.orm.entity';
import { OrderOwnerRejectionOrmEntity } from './order/infrastructure/orm-entities/order-owner-rejection.orm';
import { UserOrmEntity } from './user/infrastructure/orm-entities/user.orm.entity';
import { OwnerOrmEntity } from './user/infrastructure/orm-entities/owner.orm.entity';
import { CustomerOrmEntity } from './user/infrastructure/orm-entities/customer.orm.entity';
import { DriverOrmEntity } from './user/infrastructure/orm-entities/driver.orm.entity';

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
        UserOrmEntity,
        OwnerOrmEntity,
        CustomerOrmEntity,
        DriverOrmEntity,
        RestaurantOrmEntity,
        OrderOrmEntity,
        OrderDriverRejectionOrmEntity,
        // OrderOwnerRejectionOrmEntity,
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
