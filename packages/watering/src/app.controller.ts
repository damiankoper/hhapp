import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeviceType } from 'api-common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(`iot/${DeviceType.WATERING_CAN}/toggle`)
  public toggle() {
    this.appService.toggle();
  }
}
