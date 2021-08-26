import { Test, TestingModule } from '@nestjs/testing';
import { ListItemCrudService } from './list-item-crud.service';

describe('ListItemCrudService', () => {
  let service: ListItemCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListItemCrudService],
    }).compile();

    service = module.get<ListItemCrudService>(ListItemCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
