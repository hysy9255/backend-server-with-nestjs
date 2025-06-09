// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   canActivate(context: ExecutionContext) {
//     const gqlContext = GqlExecutionContext.create(context).getContext();
//     const user = gqlContext.req.user;
//     if (!user) {
//       return false;
//     }
//     return true;
//   }
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';
import { AllowedRoles } from './role.decorator';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { UserRole } from 'src/constants/userRole';
import { DriverMapper } from 'src/user/mapper/driver.mapper';
import { OwnerMapper } from 'src/user/mapper/owner.mapper';
import { CustomerMapper } from 'src/user/mapper/customer.mapper';
import { UserOrmEntity } from 'src/user/orm-entities/user.orm.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const roles = this.reflector.get<AllowedRoles>(
    //   'roles',
    //   context.getHandler(),
    // );

    // if (!roles) {
    //   return true;
    // }

    // let req: any;

    // GraphQL 요청인지 확인
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      const userRecord: UserOrmEntity = gqlContext.req?.user;

      gqlContext['userRecord'] = userRecord;

      // // console.log(userRecord);

      // if (!userRecord) return false;

      // let domainUser: DriverEntity | OwnerEntity | CustomerEntity | undefined;

      // switch (userRecord.role) {
      //   case UserRole.Delivery:
      //     domainUser = await this.userService.findDriverByUserId(userRecord.id);
      //     break;
      //   case UserRole.Owner:
      //     domainUser = await this.userService.findOwnerByUserId(userRecord.id);
      //     break;
      //   case UserRole.Client:
      //     domainUser = await this.userService.findCustomerByUserId(
      //       userRecord.id,
      //     );
      //     break;
      // }

      // if (domainUser) {
      //   gqlContext['domainUser'] = domainUser;

      //   // if (roles.includes('Any')) return true;
      //   // return roles.includes(userRecord.role);
      // }

      return true;

      // const gqlContext = GqlExecutionContext.create(context).getContext();
      // const token = gqlContext.token;
      // if (token) {
      //   const decoded = this.jwtService.verify(token.toString());
      //   const userRecord = await this.userService.findUserById(decoded['id']);
      //   let domainUser: DriverEntity | OwnerEntity | CustomerEntity;
      //   switch (userRecord.role) {
      //     case UserRole.Delivery:
      //       domainUser =
      //         await this.userService.findDriverByUserRecord(userRecord);
      //       break;
      //     case UserRole.Owner:
      //       domainUser =
      //         await this.userService.findOwnerByUserRecord(userRecord);
      //       break;
      //     case UserRole.Client:
      //       domainUser =
      //         await this.userService.findCustomerByUserRecord(userRecord);
      //       break;
      //   }
      //   if (domainUser) {
      //     gqlContext['domainUser'] = domainUser;
      //     if (roles.includes('Any')) {
      //       return true;
      //     }
      //     return roles.includes(userRecord.role);
      //   }
      // }
    } else {
      // HTTP 요청 (REST)
      // req = context.switchToHttp().getRequest();
    }

    // const user = req.user;

    // if (!user) {
    //   return false;
    // }
    // return true;
    return false;
  }
}
