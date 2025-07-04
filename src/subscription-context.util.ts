import { Context } from 'graphql-ws';
import { GlobalApp } from './global-app';
import { JwtService } from './jwt/jwt.service';
import { UserAuthService } from './user/application/service/user.auth.service';
import { UserInfoProjection } from './user/infrastructure/repositories/query/user.info.projection';
import { UserRole } from './constants/userRole';

export const buildSubscriptionContext = async (ctx: Context<any>) => {
  const token = ctx.connectionParams?.['jwt-token'] as string;

  const jwtService = GlobalApp.get(JwtService) as JwtService;
  const userAuthService = GlobalApp.get(UserAuthService) as UserAuthService;
  const decoded = jwtService.verify(token);
  const subscriber = await userAuthService.findUserForMiddlewareById(
    decoded['id'],
  );

  let subscriberInfo: UserInfoProjection;

  switch (subscriber.role) {
    case UserRole.Owner:
      subscriberInfo = await userAuthService._getOwnerInfo(subscriber.id);
      break;
    case UserRole.Client:
      subscriberInfo = await userAuthService._getClientInfo(subscriber.id);
      break;
    case UserRole.Driver:
      subscriberInfo = await userAuthService._getDriverInfo(subscriber.id);
      break;
    default:
      throw new Error('Unsupported subscriber role');
  }

  const printPhrase =
    `🔌 Subscription Connection Info:\n` +
    `  - Email: ${subscriber?.email}\n` +
    `  - Role: ${subscriberInfo.role}\n` +
    `  - UserId: ${subscriberInfo.userId}\n`;

  if (subscriberInfo.role === UserRole.Owner) {
    console.log(printPhrase + `  - OwnerId: ${subscriberInfo.ownerId}\n`);
  } else if (subscriberInfo.role === UserRole.Client) {
    console.log(printPhrase + `  - OwnerId: ${subscriberInfo.clientId}\n`);
  } else if (subscriberInfo.role === UserRole.Driver) {
    console.log(printPhrase + `  - OwnerId: ${subscriberInfo.driverId}\n`);
  }

  (ctx.extra as any).subscriberInfo = subscriberInfo;
};
