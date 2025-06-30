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
import { UserOrmEntity } from './user/infrastructure/orm-entities/user.orm.entity';
import { OwnerOrmEntity } from './user/infrastructure/orm-entities/owner.orm.entity';
import { CustomerOrmEntity } from './user/infrastructure/orm-entities/customer.orm.entity';
import { DriverOrmEntity } from './user/infrastructure/orm-entities/driver.orm.entity';
import { GlobalApp } from './global-app';
import { JwtService } from './jwt/jwt.service';
import { UserService } from './user/application/service/user.service';
import { UserAuthService } from './user/application/service/user-auth.service';
import { Context } from 'graphql-ws';
import { UserRole } from './constants/userRole';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (() => {
        switch (process.env.NODE_ENV) {
          case 'development.local':
            return '.env.development.local';
          case 'test.local':
            return '.env.test.local';
          case 'production.local':
          default:
            return '.env.production.local';
        }
      })(),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: async (ctx: Context<any>) => {
            const { connectionParams, extra } = ctx;
            const token = connectionParams?.['jwt-token'] as string;

            const jwtService = GlobalApp.get(JwtService) as JwtService;
            const userAuthService = GlobalApp.get(
              UserAuthService,
            ) as UserAuthService;
            const decoded = jwtService.verify(token);

            const user = await userAuthService.findUserForMiddlewareById(
              decoded['id'],
            );

            // let owner;
            // let client;
            // let driver;
            // if (user?.role === UserRole.Owner) {
            //   owner = await userSerivce.findOwnerById(user.id);
            //   (ctx.extra as any).owner = owner;
            // } else if (user?.role === UserRole.Client) {
            //   client = await userService.findClientById(user.id);
            //   (ctx.extra as any).client = client;
            // } else if (user?.role === UserRole.Delivery) {
            //   driver = await userSerivce.findDriverById(user.id);
            //   (ctx.extra as any).driver = driver;
            // }

            console.log('user', user);
            if (!user) throw new Error('Unauthorized');

            (ctx.extra as any).user = user;
          },
        },
      },
      // context: ({ req }) => ({ req }),
      context: ({ req, extra }) => {
        if (extra) {
          return extra;
        }
        // if (req) {
        //   // ✅ for queries/mutations
        //   return {
        //     token: req.headers['jwt-token'],
        //   };
        // }
      },
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
      synchronize: false,
    }),
    UserModule,
    JwtModule,
    AuthModule,
    RestaurantModule,
    DishModule,
    OrderModule,
  ],
  controllers: [],
  providers: [JwtMiddleWare],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleWare)
      .forRoutes(
        { path: 'graphql', method: RequestMethod.POST },
        { path: '/api/*path', method: RequestMethod.ALL },
      );
  }
}
