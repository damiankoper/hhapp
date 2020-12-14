import { Test, TestingModule } from '@nestjs/testing';
import { ItemCrudService } from './item-crud.service';

describe('ItemCrudService', () => {
  let service: ItemCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemCrudService],
    }).compile();

    service = module.get<ItemCrudService>(ItemCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
