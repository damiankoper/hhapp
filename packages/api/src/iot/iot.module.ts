import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { WateringController } from './watering/watering.controller';
import { WateringGateway } from './watering/watering.gateway';

export const IotMqttClient = Symbol();

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: IotMqttClient,
        imports: [ConfigModule],
        useClass: ConfigService,
      },
    ]),
  ],
  providers: [WateringGateway],
  controllers: [WateringController],
})
export class IotModule {}
