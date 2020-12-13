import { Test, TestingModule } from '@nestjs/testing';
import { ShopCrudService } from './shop-crud.service';

describe('ShopCrudService', () => {
  let service: ShopCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopCrudService],
    }).compile();

    service = module.get<ShopCrudService>(ShopCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
