import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { Category } from 'src/shopping/entities/category.entity';
import { Item } from 'src/shopping/entities/item.entity';
import { Shop } from 'src/shopping/entities/shop.entity';
import { User } from 'src/user/entities/user.entity';
import { MigrationCommand } from './migration.command';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    TypeOrmModule.forFeature([User, Category, Shop, Item]),
    CommandModule,
  ],
  providers: [MigrationCommand],
})
export class ConsoleModule {}
