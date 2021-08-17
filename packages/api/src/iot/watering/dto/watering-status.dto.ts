import { Expose } from 'class-transformer';
import { DeviceDto } from 'src/iot/dto/device.dto';

@Expose()
export class WateringStatusDto extends DeviceDto {
  watering: boolean;
  pomp: boolean;
}
