import { OrderMapper } from 'src/order/mapper/order.mapper';
import { DriverEntity } from '../domain/driver.entity';
import { DriverRecord } from '../orm-records/driver.record';

export class DriverMapper {
  static toRecord(driverEntity: DriverEntity): DriverRecord {
    const driverRecord = new DriverRecord();
    driverRecord.id = driverEntity.id;
    if (driverEntity.rejectedOrders) {
      driverRecord.rejectedOrders = driverEntity.rejectedOrders?.map(
        (rejectedOrder) => OrderMapper.toRecord(rejectedOrder),
      );
    }
    if (driverEntity.assignedOrders) {
      driverRecord.assignedOrders = driverEntity.assignedOrders?.map(
        (assigendOrder) => OrderMapper.toRecord(assigendOrder),
      );
    }

    return driverRecord;
  }

  static toDomain(driverRecord: DriverRecord): DriverEntity {
    return DriverEntity.fromPersistance(
      driverRecord.id,
      driverRecord.rejectedOrders,
      driverRecord.assignedOrders,
    );
  }
}
