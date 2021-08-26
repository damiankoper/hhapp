import { Test, TestingModule } from '@nestjs/testing';
import { ListItemCrudController } from './list-item-crud.controller';

describe('ListItemCrudController', () => {
  let controller: ListItemCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListItemCrudController],
    }).compile();

    controller = module.get<ListItemCrudController>(ListItemCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
