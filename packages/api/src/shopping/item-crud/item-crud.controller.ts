import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Item } from '../entities/item.entity';
import { Shop } from '../entities/shop.entity';
import { ItemCrudService } from './item-crud.service';

@Crud({
  model: {
    type: Shop,
  },
  query: {
    alwaysPaginate: true,
  },
})
@ApiTags('shopping/items')
@Controller('shopping/items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ItemCrudController implements CrudController<Item> {
  constructor(public service: ItemCrudService) {}
}
