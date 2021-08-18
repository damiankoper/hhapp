import { Expose } from 'class-transformer';
import { Device } from '../../models/device.model';

@Expose()
export class WateringStatus extends Device {
  enabled: boolean;
  pompOn: boolean;
}
