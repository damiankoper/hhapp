import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, PartialType } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import { UserCrudService } from './user-crud.service';

@Crud({
  model: {
    type: User,
  },
  query: {
    exclude: ['password'],
    alwaysPaginate: true,
  },
  dto: {
    update: PartialType(User),
  },
})
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserCrudController implements CrudController<User> {
  constructor(public service: UserCrudService) {}
}
