import { Test, TestingModule } from '@nestjs/testing';
import { ListCrudService } from './list-crud.service';

describe('ListCrudService', () => {
  let service: ListCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListCrudService],
    }).compile();

    service = module.get<ListCrudService>(ListCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
