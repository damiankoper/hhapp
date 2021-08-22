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

  @Get('debts')
  public debts(@Query('date') date: string) {
    return this.itemService.getDebts(DateTime.fromISO(date));
  }

  @Get('by-user')
  public byUser(@Query('from') from: string, @Query('to') to: string) {
    return this.itemService.getByUser(
      DateTime.fromISO(from),
      DateTime.fromISO(to),
    );
  }

  @Get('by-category')
  public byCateogry(@Query('from') from: string, @Query('to') to: string) {
    return this.itemService.getByCategory(
      DateTime.fromISO(from),
      DateTime.fromISO(to),
    );
  }

  @Get('monthly')
  public monthly(@Query('from') from: string, @Query('to') to: string) {
    return this.itemService.getMonthly(
      DateTime.fromISO(from),
      DateTime.fromISO(to),
    );
  }
}
