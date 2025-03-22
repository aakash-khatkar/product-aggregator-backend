import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/database/prisma.service';
import * as request from 'supertest';
import { ProductSyncService } from 'src/product/sync/product-sync.service';
import { NormalizedProduct } from 'src/product/interfaces/normalized-product.interface';

describe('Product Sync + Change API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let productSyncService: ProductSyncService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    productSyncService = app.get(ProductSyncService);

    // Clean test DB
    await prisma.productHistory.deleteMany();
    await prisma.productProvider.deleteMany();
    await prisma.product.deleteMany();
    await prisma.provider.deleteMany();

    // Seed minimal product & provider
    const provider = await prisma.provider.create({
      data: {
        name: 'TestProvider',
        baseUrl: 'http://fake-provider',
        isActive: true,
        staleAfterMs: 60000,
        maxRetries: 3,
      },
    });

    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'Initial product',
        isActive: true,
      },
    });

    await prisma.productProvider.create({
      data: {
        providerId: provider.id,
        productId: product.id,
        externalId: 'ext-1',
        price: 10,
        currency: 'USD',
        availability: true,
        lastProviderUpdate: new Date(Date.now() - 60000),
        isActive: true,
        isStale: false,
      },
    });

    // Perform first sync with initial state to generate history
    await productSyncService.sync('TestProvider', [
      {
        externalId: 'ext-1',
        name: 'Test Product',
        description: 'Initial product',
        price: 10,
        currency: 'USD',
        availability: true,
        lastProviderUpdate: new Date(Date.now() - 5000),
      },
    ]);

    await new Promise(resolve => setTimeout(resolve, 200));
  });

  afterAll(async () => {
    await app.close();
  });

  it('should track change after sync and expose via /products/changes', async () => {
    const now = new Date(Date.now() - 1000); // Capture time before next change

    const updatePayload: NormalizedProduct[] = [
      {
        externalId: 'ext-1',
        name: 'Test Product',
        description: 'Initial product',
        price: 20,
        currency: 'USD',
        availability: false,
        lastProviderUpdate: new Date(),
      },
    ];

    await productSyncService.sync('TestProvider', updatePayload);

    await new Promise(resolve => setTimeout(resolve, 300));

    const response = await request(app.getHttpServer())
      .get('/products/changes')
      .query({ since: now.toISOString(), page: 1, limit: 10 })
      .expect(200);

    const { data } = response.body;
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);

    const changeEntry = data[0].changes[0];
    expect(changeEntry.oldPrice).toBe(10);
    expect(changeEntry.newPrice).toBe(20);
    expect(changeEntry.oldAvailability).toBe(true);
    expect(changeEntry.newAvailability).toBe(false);
  });
});