import { Test, TestingModule } from '@nestjs/testing';
import { ListCrudController } from './list-crud.controller';

describe('ListCrudController', () => {
  let controller: ListCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListCrudController],
    }).compile();

    controller = module.get<ListCrudController>(ListCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
