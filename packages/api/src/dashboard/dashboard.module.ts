import { Module } from '@nestjs/common';
import { ShoppingModule } from 'src/shopping/shopping.module';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [ShoppingModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
