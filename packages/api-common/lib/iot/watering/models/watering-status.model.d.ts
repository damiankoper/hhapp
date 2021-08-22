import { DeviceType } from '../../enums/device-type.enum';
import { Device } from '../../models/device.model';
export declare class WateringStatus extends Device {
    type: DeviceType;
    enabled: boolean;
    pompOn: boolean;
}
