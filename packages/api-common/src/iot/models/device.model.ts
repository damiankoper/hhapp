import { DeviceType } from '../enums/device-type.enum';
import getMAC from 'getmac';

export abstract class Device {
  id: string;
  mac: string;
  abstract type: DeviceType;

  displayName: string | null = null;

  timestamp = 0;

  constructor(id: string, displayName: string) {
    this.id = id;
    this.mac = getMAC();
    this.displayName = displayName;
  }
}
