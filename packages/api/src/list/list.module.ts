import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListItem } from './items/entities/list-item.entity';
import { ListItemCrudController } from './items/list-item-crud.controller';
import { ListItemCrudService } from './items/list-item-crud.service';
import { ListCrudController } from './list-crud.controller';
import { ListCrudService } from './list-crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([List, ListItem])],
  providers: [ListCrudService, ListItemCrudService],
  controllers: [ListCrudController, ListItemCrudController],
  exports: [TypeOrmModule],
})
export class ListModule {}
