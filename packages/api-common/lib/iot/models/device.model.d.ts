import { DeviceType } from '../enums/device-type.enum';
import { IDevice } from '../interfaces/device.interface';
export declare abstract class Device implements IDevice {
    id: string;
    mac: string;
    abstract type: DeviceType;
    displayName: string | null;
    timestamp: number;
    constructor(id: string, displayName: string);
}
