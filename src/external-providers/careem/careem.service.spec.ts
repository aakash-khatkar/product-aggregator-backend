import { Test, TestingModule } from '@nestjs/testing';
import { CareemService } from './careem.service';

describe('CareemService', () => {
  let service: CareemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CareemService],
    }).compile();

    service = module.get<CareemService>(CareemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
