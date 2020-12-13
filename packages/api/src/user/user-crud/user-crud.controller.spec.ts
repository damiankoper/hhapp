import { Test, TestingModule } from '@nestjs/testing';
import { UserCrudController } from './user-crud.controller';

describe('UserCrudController', () => {
  let controller: UserCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCrudController],
    }).compile();

    controller = module.get<UserCrudController>(UserCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
