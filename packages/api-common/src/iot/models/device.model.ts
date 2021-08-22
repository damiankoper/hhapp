import { DeviceType } from '../enums/device-type.enum';
import getMAC from 'getmac';
import { IDevice } from '../interfaces/device.interface';

export abstract class Device implements IDevice{
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
