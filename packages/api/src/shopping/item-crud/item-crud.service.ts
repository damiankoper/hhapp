import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Item } from '../entities/item.entity';

@Injectable()
export class ItemCrudService extends TypeOrmCrudService<Item> {
  constructor(@InjectRepository(Item) repo) {
    super(repo);
  }
}
