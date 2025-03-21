import { Test, TestingModule } from '@nestjs/testing';
import { CareemController } from './careem.controller';

describe('CareemController', () => {
  let controller: CareemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareemController],
    }).compile();

    controller = module.get<CareemController>(CareemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
