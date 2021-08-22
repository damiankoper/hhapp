import { DeviceType } from '../enums/device-type.enum';
export declare abstract class Device {
    id: string;
    mac: string;
    abstract type: DeviceType;
    displayName: string | null;
    timestamp: number;
    constructor(id: string, displayName: string);
}
