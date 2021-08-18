import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { IotMqttClient } from './config/constants';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: IotMqttClient,
        imports: [ConfigModule],
        useExisting: ConfigService,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
