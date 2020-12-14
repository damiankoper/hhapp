import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Shop } from '../entities/shop.entity';
import { ShopCrudService } from './shop-crud.service';

@Crud({
  model: {
    type: Shop,
  },
  query: {
    alwaysPaginate: true,
  },
})
@ApiTags('shops')
@Controller('shops')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShopCrudController implements CrudController<Shop> {
  constructor(public service: ShopCrudService) {}
}
