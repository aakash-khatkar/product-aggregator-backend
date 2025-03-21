import { Test, TestingModule } from '@nestjs/testing';
import { NoonController } from './noon.controller';

describe('NoonController', () => {
  let controller: NoonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoonController],
    }).compile();

    controller = module.get<NoonController>(NoonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
