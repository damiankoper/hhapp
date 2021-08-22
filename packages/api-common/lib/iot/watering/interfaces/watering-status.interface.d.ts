import { DeviceType } from '../../enums/device-type.enum';
import { IDevice } from '../../interfaces/device.interface';
export interface IWateringStatus extends IDevice {
    type: DeviceType;
    enabled: boolean;
    pompOn: boolean;
}
