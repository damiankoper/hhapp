import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WateringStatusDto } from './dto/watering-status.dto';
import { WateringGateway } from './watering.gateway';

@Controller()
export class WateringController {
  constructor(private readonly wateringGateway: WateringGateway) {}

  @MessagePattern('iot/watering/status')
  getNotifications(@Payload() data: WateringStatusDto) {
    this.wateringGateway.wsServer.emit('iot/watering/status', data);
  }
}
