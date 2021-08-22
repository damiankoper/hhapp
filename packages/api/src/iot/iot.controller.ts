import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Device } from 'api-common';
import { IotGateway } from './iot.gateway';

@Controller()
export class IotController {
  constructor(private readonly iotGateway: IotGateway) {}

  @MessagePattern('iot/+/status')
  getNotifications(@Payload() data: Device) {
    this.iotGateway.emitStatus(data);
  }
}
