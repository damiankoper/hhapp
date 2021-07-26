import { Controller, Get, Query } from '@nestjs/common';
import { ItemService } from 'src/shopping/item/item.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly itemService: ItemService) {}

  @Get('counters')
  public counters(@Query('date') date: string) {
    return this.itemService.getCounters(new Date(date));
  }
}
