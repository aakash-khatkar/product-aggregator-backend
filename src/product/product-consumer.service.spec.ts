import { Test, TestingModule } from '@nestjs/testing';
import { ProductConsumerService } from './product-consumer.service';

describe('ProductConsumerService', () => {
  let service: ProductConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductConsumerService],
    }).compile();

    service = module.get<ProductConsumerService>(ProductConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
