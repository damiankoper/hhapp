import { Test, TestingModule } from '@nestjs/testing';
import { ItemCrudController } from './item-crud.controller';

describe('ItemCrudController', () => {
  let controller: ItemCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemCrudController],
    }).compile();

    controller = module.get<ItemCrudController>(ItemCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
