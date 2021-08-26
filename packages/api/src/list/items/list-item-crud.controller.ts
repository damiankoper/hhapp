import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ListItem } from './entities/list-item.entity';
import { ListItemCrudService } from './list-item-crud.service';

@Crud({
  model: {
    type: ListItem,
  },
  query: {
    alwaysPaginate: true,
  },
})
@ApiTags('list-items')
@Controller('list-items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ListItemCrudController implements CrudController<ListItem> {
  constructor(public service: ListItemCrudService) {}
}
