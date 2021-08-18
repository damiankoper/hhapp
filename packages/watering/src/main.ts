import { NestFactory } from '@nestjs/core';
import { MqttOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MqttOptions>(
    AppModule,
    new ConfigService().createClientOptions(),
  );
  await app.listen();
}
bootstrap();
