import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ShoppingModule } from './shopping/shopping.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IotModule } from './iot/iot.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    UserModule,
    AuthModule,
    ShoppingModule,
    DashboardModule,
    IotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
