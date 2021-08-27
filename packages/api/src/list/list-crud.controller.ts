import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { List } from './entities/list.entity';
import { ListCrudService } from './list-crud.service';

@Crud({
  model: {
    type: List,
  },
  query: {
    alwaysPaginate: true,
    join: {
      createdBy: {},
      items: {},
    },
  },
})
@ApiTags('lists')
@Controller('lists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ListCrudController implements CrudController<List> {
  constructor(public service: ListCrudService) {}
}
