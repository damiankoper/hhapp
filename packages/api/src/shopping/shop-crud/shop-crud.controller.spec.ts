import { Test, TestingModule } from '@nestjs/testing';
import { ShopCrudController } from './shop-crud.controller';

describe('ShopCrudController', () => {
  let controller: ShopCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopCrudController],
    }).compile();

    controller = module.get<ShopCrudController>(ShopCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
