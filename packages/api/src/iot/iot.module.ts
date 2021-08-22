import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { IotMqttClient } from './constants';
import { IotController } from './iot.controller';
import { IotGateway } from './iot.gateway';

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
  providers: [IotGateway, IotController],
  controllers: [IotController],
})
export class IotModule {}
