import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { List } from './entities/list.entity';

@Injectable()
export class ListCrudService extends TypeOrmCrudService<List> {
  constructor(@InjectRepository(List) repo) {
    super(repo);
  }
}
