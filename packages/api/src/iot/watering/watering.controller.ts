import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WateringStatus } from './models/watering-status.model';
import { WateringGateway } from './watering.gateway';

@Controller()
export class WateringController {
  constructor(private readonly wateringGateway: WateringGateway) {}

  @MessagePattern('iot/watering/status')
  getNotifications(@Payload() data: WateringStatus) {
    this.wateringGateway.wsServer.emit('iot/watering/status', data);
  }
}
