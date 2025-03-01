import { Test, TestingModule } from '@nestjs/testing';
import { RehearsalsService } from './rehearsals.service';

describe('RehearsalsService', () => {
  let service: RehearsalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RehearsalsService],
    }).compile();

    service = module.get<RehearsalsService>(RehearsalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
