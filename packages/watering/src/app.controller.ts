import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('iot/watering/toggle')
  public toggle() {
    console.log('Toggle');
    this.appService.toggle();
  }
}
