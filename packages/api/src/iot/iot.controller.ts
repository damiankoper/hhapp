import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IDevice } from 'api-common';
import { IotGateway } from './iot.gateway';

@Controller()
export class IotController {
  constructor(private readonly iotGateway: IotGateway) {}

  @MessagePattern('iot/+/status')
  getNotifications(@Payload() data: IDevice) {
    this.iotGateway.emitStatus(data);
  }
}
