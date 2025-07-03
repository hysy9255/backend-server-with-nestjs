// order-noti-filter.ts
import { UserRole } from 'src/constants/userRole';

type OrderNotiPayload = {
  method: string;
};

type UserContext = {
  user: {
    role: UserRole;
  };
};

export function shouldNotifySubscriber(
  payload: OrderNotiPayload,
  context: UserContext,
): boolean {
  const method = payload.method;
  const role = context.user.role;

  //   console.log(method);
  //   console.log(role);

  const allowedMap: Record<string, UserRole[]> = {
    order_created: [UserRole.Owner],
    order_accepted_by_owner: [UserRole.Client, UserRole.Driver],
    order_ready: [UserRole.Driver],
    order_accepted_by_driver: [UserRole.Owner],
    order_picked_up: [UserRole.Client, UserRole.Owner],
    order_delivered: [UserRole.Client, UserRole.Owner],
  };

  return allowedMap[method]?.includes(role) ?? false;
}
