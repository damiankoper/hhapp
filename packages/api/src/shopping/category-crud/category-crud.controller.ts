import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Category } from '../entities/category.entity';
import { CategoryCrudService } from './category-crud.service';

@Crud({
  model: {
    type: Category,
  },
  query: {
    alwaysPaginate: true,
  },
})
@ApiTags('shopping/categories')
@Controller('shopping/categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoryCrudController implements CrudController<Category> {
  constructor(public service: CategoryCrudService) {}
}
