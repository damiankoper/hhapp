import { Expose } from 'class-transformer';
import { DeviceType } from '../../enums/device-type.enum';
import { Device } from '../../models/device.model';

@Expose()
export class WateringStatus extends Device {
  type = DeviceType.WATERING_CAN;
  enabled = false;
  pompOn = false;
}
