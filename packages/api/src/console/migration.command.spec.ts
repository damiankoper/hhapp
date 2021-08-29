import { Test, TestingModule } from '@nestjs/testing';
import { MigrationCommand } from './migration.command';

describe('MigrationCommand', () => {
  let service: MigrationCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MigrationCommand],
    }).compile();

    service = module.get<MigrationCommand>(MigrationCommand);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
