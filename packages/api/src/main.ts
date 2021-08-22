import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MqttOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TypeOrmExceptionFilter } from './common/typeorm.exception-filter';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new TypeOrmExceptionFilter());
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('HouseholaApp API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const microservice = app.connectMicroservice<MqttOptions>(
    app.get(ConfigService).createClientOptions(),
  );
  microservice.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
