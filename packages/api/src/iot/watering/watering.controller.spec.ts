import { Test, TestingModule } from '@nestjs/testing';
import { WateringController } from './watering.controller';

describe('WateringController', () => {
  let controller: WateringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WateringController],
    }).compile();

    controller = module.get<WateringController>(WateringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
