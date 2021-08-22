import { DeviceType } from "../enums/device-type.enum";
export interface IDevice {
    id: string;
    mac: string;
    type: DeviceType;
    displayName: string | null;
    timestamp: number;
}
