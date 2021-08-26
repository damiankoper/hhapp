import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ListItem } from './entities/list-item.entity';

@Injectable()
export class ListItemCrudService extends TypeOrmCrudService<ListItem> {
  constructor(@InjectRepository(ListItem) repo) {
    super(repo);
  }
}
