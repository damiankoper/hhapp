import { Test, TestingModule } from '@nestjs/testing';
import { CategoryCrudService } from './category-crud.service';

describe('CategoryCrudService', () => {
  let service: CategoryCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryCrudService],
    }).compile();

    service = module.get<CategoryCrudService>(CategoryCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
