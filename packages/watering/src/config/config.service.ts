import { Injectable } from '@nestjs/common';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
  MqttOptions,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ConfigService implements ClientsModuleOptionsFactory {
  isDev() {
    return process.env.NODE_ENV !== 'production';
  }

  isProd() {
    return process.env.NODE_ENV === 'production';
  }

  createClientOptions(): ClientProvider & MqttOptions {
    return {
      transport: Transport.MQTT,
      options: {
        url: process.env.MQTT_BROKER_URL,
      },
    };
  }

  getRelayPin(): number {
    return +process.env.PIN_RELAY || 17;
  }
}
