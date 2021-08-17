import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { IotMqttClient } from './constants';
import { WateringController } from './watering/watering.controller';
import { WateringGateway } from './watering/watering.gateway';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: IotMqttClient,
        imports: [ConfigModule],
        useExisting: ConfigService,
      },
    ]),
  ],
  providers: [WateringGateway, WateringController],
  controllers: [WateringController],
})
export class IotModule {}
