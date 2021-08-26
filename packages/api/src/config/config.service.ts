import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
  MqttOptions,
  Transport,
} from '@nestjs/microservices';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { List } from 'src/list/entities/list.entity';
import { ListItem } from 'src/list/items/entities/list-item.entity';
import { Category } from 'src/shopping/entities/category.entity';
import { Item } from 'src/shopping/entities/item.entity';
import { Shop } from 'src/shopping/entities/shop.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConfigService
  implements
    TypeOrmOptionsFactory,
    JwtOptionsFactory,
    ClientsModuleOptionsFactory
{
  isDev() {
    return process.env.NODE_ENV !== 'production';
  }
  isProd() {
    return process.env.NODE_ENV === 'production';
  }
  createJwtSecretOptions() {
    return {
      secret: process.env.JWT_SECRET || 'secret0',
      secretExpiresIn: process.env.JWT_SECRET_EXPIRES_IN || '1h',
      secretRefresh: process.env.JWT_SECRET_REFRESH || 'secret1',
      secretRefreshExpiresIn: process.env.JWT_SECRET_REFRESH_EXPIRES_IN || '1d',
      secretRefreshRememberExpiresIn:
        process.env.JWT_SECRET_REFRESH_REMEMBER_EXPIRES_IN || '7d',
    };
  }

  createJwtOptions(): JwtModuleOptions {
    return {
      /** Default secret */
      secret: process.env.JWT_SECRET || 'secret1',
    };
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'database',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'main',
      entities: [User, Shop, Category, Item, List, ListItem],
      synchronize: true,
      logging:
        process.env.NODE_ENV !== 'production'
          ? 'all'
          : ['error', 'warn', 'info', 'log', 'migration'],
    };
  }

  createClientOptions(): ClientProvider & MqttOptions {
    return {
      transport: Transport.MQTT,
      options: {
        url: process.env.MQTT_BROKER_URL || 'mqtt://mqtt-broker:1883',
      },
    };
  }
}
