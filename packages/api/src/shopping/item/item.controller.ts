import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ItemService } from './item.service';

@ApiTags('shopping/items')
@Controller('shopping/items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('autocomplete')
  public autocomplete(@Query('name') name: string) {
    return this.itemService.autocomplete(name, 5);
  }
}
