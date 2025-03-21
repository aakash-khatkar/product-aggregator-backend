import { Test, TestingModule } from '@nestjs/testing';
import { NoonService } from './noon.service';

describe('NoonService', () => {
  let service: NoonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoonService],
    }).compile();

    service = module.get<NoonService>(NoonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
