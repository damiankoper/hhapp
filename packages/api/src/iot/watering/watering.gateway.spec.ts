import { Test, TestingModule } from '@nestjs/testing';
import { WateringGateway } from './watering.gateway';

describe('WateringGateway', () => {
  let gateway: WateringGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WateringGateway],
    }).compile();

    gateway = module.get<WateringGateway>(WateringGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
