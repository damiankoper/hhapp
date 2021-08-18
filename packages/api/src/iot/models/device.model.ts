export abstract class Device {
  id: string;
  mac?: string;
  name = 'Undefined device';
  timestamp: number;
}
