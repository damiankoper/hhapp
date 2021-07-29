import { Controller, Get, Query } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ItemService } from 'src/shopping/item/item.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly itemService: ItemService) {}

  @Get('counters')
  public counters(@Query('date') date: string) {
    return this.itemService.getCounters(DateTime.fromISO(date));
  }

  @Get('monthly')
  public monthly(@Query('from') from: string, @Query('to') to: string) {
    return this.itemService.getMonthly(
      DateTime.fromISO(from),
      DateTime.fromISO(to),
    );
  }
}
