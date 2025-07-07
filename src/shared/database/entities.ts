import { OrderDriverRejectionOrmEntity } from 'src/order/infrastructure/orm-entities/order-driver-rejection.orm';
import { OrderOrmEntity } from 'src/order/infrastructure/orm-entities/order.orm.entity';
import { RestaurantOrmEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm.entity';
import { ClientOrmEntity } from 'src/user/infrastructure/orm-entities/client.orm.entity';
import { DriverOrmEntity } from 'src/user/infrastructure/orm-entities/driver.orm.entity';
import { OwnerOrmEntity } from 'src/user/infrastructure/orm-entities/owner.orm.entity';
import { UserOrmEntity } from 'src/user/infrastructure/orm-entities/user.orm.entity';

export const ENTITIES = [
  UserOrmEntity,
  OwnerOrmEntity,
  ClientOrmEntity,
  DriverOrmEntity,
  RestaurantOrmEntity,
  OrderOrmEntity,
  OrderDriverRejectionOrmEntity,
];
