import { Test, TestingModule } from '@nestjs/testing';
import { ProductSyncService } from './product-sync.service';
import { PrismaService } from 'src/database/prisma.service';
import { NormalizedProduct } from '../interfaces/normalized-product.interface';

describe('ProductSyncService', () => {
  let service: ProductSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductSyncService, PrismaService],
    }).compile();

    service = module.get<ProductSyncService>(ProductSyncService);
  });

  describe('buildUpdateAndHistoryPayloads', () => {
    it('should create history and update when product data changes', () => {
      const products: NormalizedProduct[] = [
        {
          externalId: 'external-1',
          name: 'Sample Product',
          description: 'Desc',
          price: 99,
          currency: 'USD',
          availability: true,
          lastProviderUpdate: new Date(),
        },
      ];

      const existingMap = new Map([
        ['external-1', {
          id: 'pp-id-1',
          productId: 'p-id-1',
          price: 50,
          availability: false,
        }],
      ]);

      const { updates, historyRecords } = (service as any).buildUpdateAndHistoryPayloads(
        products,
        existingMap,
        'provider-id',
      );

      expect(updates).toHaveLength(1);
      expect(historyRecords).toHaveLength(1);
      expect(historyRecords[0].price).toBe(99);
      expect(historyRecords[0].availability).toBe(true);
    });

    it('should not create history if product data is same', () => {
      const now = new Date();
      const products: NormalizedProduct[] = [
        {
          externalId: 'external-2',
          name: 'Same Product',
          description: 'Desc',
          price: 50,
          currency: 'USD',
          availability: true,
          lastProviderUpdate: now,
        },
      ];

      const existingMap = new Map([
        ['external-2', {
          id: 'pp-id-2',
          productId: 'p-id-2',
          price: 50,
          availability: true,
        }],
      ]);

      const { updates, historyRecords } = (service as any).buildUpdateAndHistoryPayloads(
        products,
        existingMap,
        'provider-id',
      );

      expect(updates).toHaveLength(1); // still need to update timestamps etc.
      expect(historyRecords).toHaveLength(0);
    });
  });
});