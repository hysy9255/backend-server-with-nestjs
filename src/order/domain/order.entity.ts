import { BadRequestException, ConflictException } from '@nestjs/common';
import { OrderStatus } from 'src/constants/orderStatus';
import { ClientEntity } from 'src/user/domain/client.entity';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { v4 as uuidv4 } from 'uuid';

export const StatusErrMsg = {
  notPending: 'Order must be pending',
  notAccepted: 'Order must be accepted',
  notReady: 'Order must be ready',
  notAcceptedNorReady: 'Order must be accepted or ready',
  notPickedUp: 'Order must be picked up',
};

export const DriverErrMsg = {
  alreadyRejected: 'This driver already rejected the order',
  alreadyAssigned: 'This driver is already assigned to the order',
  alreadyAssignedToAnother: 'Another driver is already assigned to this order',
  notYetAssignedToAny: 'No driver is assigned to this order yet',
};

export class OrderEntity {
  constructor(
    private readonly _id: string,
    private readonly _restaurantId: string,
    private readonly _clientId: string,
    private _status: OrderStatus,
    private _driverId: string | null = null,
    private _rejectedDriverIds: string[] = [],
  ) {}

  static createNew(restaurantId: string, clientId: string): OrderEntity {
    return new OrderEntity(
      uuidv4(),
      restaurantId,
      clientId,
      OrderStatus.Pending,
    );
  }

  static fromPersistance(
    id: string,
    status: OrderStatus,
    restaurantId: string,
    clientId: string,
    driverId: string | null,
    rejectedDriverIds: string[],
  ): OrderEntity {
    return new OrderEntity(
      id,
      restaurantId,
      clientId,
      status,
      driverId,
      rejectedDriverIds,
    );
  }

  isOwnedBy(client: ClientEntity): boolean {
    return this._clientId === client.id;
  }

  private ensureStatus(expected: OrderStatus[], errorMessage: string) {
    if (!expected.includes(this._status)) {
      throw new BadRequestException(errorMessage);
    }
  }
  private ensureNotRejectedBy(driver: DriverEntity) {
    if (this._rejectedDriverIds.includes(driver.id))
      throw new ConflictException(DriverErrMsg.alreadyRejected);
  }
  private ensureNotTakenBy(driver: DriverEntity) {
    if (this._driverId === driver.id)
      throw new ConflictException(DriverErrMsg.alreadyAssigned);
  }
  private ensureNotTakenByAnother(driver: DriverEntity) {
    if (this._driverId && this._driverId !== driver.id)
      throw new ConflictException(DriverErrMsg.alreadyAssignedToAnother);
  }
  private ensureTakenBySomeDriver() {
    if (!this._driverId)
      throw new BadRequestException(DriverErrMsg.notYetAssignedToAny);
  }

  private ensureDriverCanAcceptOrReject(driver: DriverEntity) {
    // 오더가 해당 드라이버에 의해 이미 거절 되었으면 안됨
    this.ensureNotRejectedBy(driver);
    // 오더에 해당 드라이버가 이미 할당 되어있으면 안됨
    this.ensureNotTakenBy(driver);
    // 오더에 다른 드라이버가 이미 할당 되어있으면 안됨
    this.ensureNotTakenByAnother(driver);
  }

  private ensureDriverCanPickUpOrDeliver(driver: DriverEntity) {
    // 오더가 해당 드라이버에 의해 이미 거절 되었있으면 안됨
    this.ensureNotRejectedBy(driver);
    // 오더에 어떤 드라이버가 할당 되어있어야 함
    this.ensureTakenBySomeDriver();
    // 오더에 다른 드라이버가 할당 되어있으면 안됨
    this.ensureNotTakenByAnother(driver);
  }

  // ==== OWNER ACTIONS ====
  markAccepted() {
    this.ensureStatus([OrderStatus.Pending], StatusErrMsg.notPending);
    this._status = OrderStatus.Accepted;
  }

  markRejected() {
    this.ensureStatus([OrderStatus.Pending], StatusErrMsg.notPending);
    this._status = OrderStatus.Rejected;
  }

  markReady() {
    this.ensureStatus([OrderStatus.Accepted], StatusErrMsg.notAccepted);
    this._status = OrderStatus.Ready;
  }

  // ==== DRIVER ACTIONS ====
  assignDriver(driver: DriverEntity) {
    this.ensureStatus(
      [OrderStatus.Accepted, OrderStatus.Ready],
      StatusErrMsg.notAcceptedNorReady,
    );
    this.ensureDriverCanAcceptOrReject(driver);
    driver.markOrderAccepted();
    this._driverId = driver.id;
  }

  markRejectedByDriver(driver: DriverEntity) {
    this.ensureStatus(
      [OrderStatus.Accepted, OrderStatus.Ready],
      StatusErrMsg.notAcceptedNorReady,
    );
    this.ensureDriverCanAcceptOrReject(driver);
    this._rejectedDriverIds.push(driver.id);
  }

  markPickedUp(driver: DriverEntity) {
    this.ensureStatus([OrderStatus.Ready], StatusErrMsg.notReady);
    this.ensureDriverCanPickUpOrDeliver(driver);
    this._status = OrderStatus.PickedUp;
  }

  markDelivered(driver: DriverEntity) {
    this.ensureStatus([OrderStatus.PickedUp], StatusErrMsg.notPickedUp);
    this.ensureDriverCanPickUpOrDeliver(driver);
    driver.markOrderCompleted();
    this._status = OrderStatus.Delivered;
  }

  get id(): string {
    return this._id;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get restaurantId(): string {
    return this._restaurantId;
  }

  get clientId(): string {
    return this._clientId;
  }

  get driverId(): string | null {
    return this._driverId;
  }

  get rejectedDriverIds(): string[] {
    return this._rejectedDriverIds;
  }
}
