import { Test, TestingModule } from '@nestjs/testing';
import { RehearsalsController } from './rehearsals.controller';

describe('RehearsalsController', () => {
  let controller: RehearsalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RehearsalsController],
    }).compile();

    controller = module.get<RehearsalsController>(RehearsalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
