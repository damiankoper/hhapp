import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Category } from 'src/shopping/entities/category.entity';
import { Item } from 'src/shopping/entities/item.entity';
import { Shop } from 'src/shopping/entities/shop.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConfigService implements TypeOrmOptionsFactory, JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: process.env['JWT_SECRET'] || 'secret',
    };
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'database',
      port: +process.env['DB_PORT'] || 5432,
      username: process.env['DB_USERNAME'] || 'root',
      password: process.env['DB_PASSWORD'] || 'password',
      database: process.env['DB_DATABASE'] || 'main',
      entities: [User, Shop, Category, Item],
      synchronize: true,
      logging:
        process.env['NODE_ENV'] !== 'production'
          ? 'all'
          : ['error', 'warn', 'info', 'log', 'migration'],
    };
  }
}
