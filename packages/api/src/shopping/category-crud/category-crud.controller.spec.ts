import { Test, TestingModule } from '@nestjs/testing';
import { CategoryCrudController } from './category-crud.controller';

describe('CategoryCrudController', () => {
  let controller: CategoryCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryCrudController],
    }).compile();

    controller = module.get<CategoryCrudController>(CategoryCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
