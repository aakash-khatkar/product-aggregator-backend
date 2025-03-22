import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const [noon, amazon, careem] = await Promise.all([
    prisma.provider.upsert({
      where: { name: 'Noon' },
      update: {},
      create: {
        name: 'Noon',
        baseUrl: 'http://localhost:3000/external/noon/products',
        staleAfterMs: 60000,
        lastFetchedAt: null,
        maxRetries: 3,
      },
    }),
    prisma.provider.upsert({
      where: { name: 'Amazon' },
      update: {},
      create: {
        name: 'Amazon',
        baseUrl: 'http://localhost:3000/external/amazon/products',
        staleAfterMs: 60000,
        lastFetchedAt: null,
        maxRetries: 3,
      },
    }),
    prisma.provider.upsert({
      where: { name: 'Careem' },
      update: {},
      create: {
        name: 'Careem',
        baseUrl: 'http://localhost:3000/external/careem/products',
        staleAfterMs: 60000,
        lastFetchedAt: null,
        maxRetries: 3,
      },
    }),
  ]);

  const products = await Promise.all([
    prisma.product.create({
      data: { name: 'Course-101', description: 'Comprehensive course on various topics' },
    }),
    prisma.product.create({
      data: { name: 'E-Book', description: 'Digital book on advanced topics' },
    }),
  ]);

  const [course, ebook] = products;

  await prisma.productProvider.createMany({
    data: [
      {
        productId: course.id,
        providerId: amazon.id,
        externalId: 'uuid-amazon-1',
        price: 19.12,
        currency: 'USD',
        availability: true,
        lastProviderUpdate: new Date(),
      },
      {
        productId: ebook.id,
        providerId: amazon.id,
        externalId: 'uuid-amazon-2',
        price: 8.10,
        currency: 'USD',
        availability: true,
        lastProviderUpdate: new Date(),
      },
      {
        productId: course.id,
        providerId: careem.id,
        externalId: 'uuid-careem-1',
        price: 20.56,
        currency: 'USD',
        availability: true,
        lastProviderUpdate: new Date(),
      },
      {
        productId: ebook.id,
        providerId: careem.id,
        externalId: 'uuid-careem-2',
        price: 10.14,
        currency: 'USD',
        availability: true,
        lastProviderUpdate: new Date(),
      },
      {
        productId: course.id,
        providerId: noon.id,
        externalId: 'uuid-noon-1',
        price: 19.12,
        currency: 'USD',
        availability: true,
        lastProviderUpdate: new Date(),
      },
      {
        productId: ebook.id,
        providerId: noon.id,
        externalId: 'uuid-noon-2',
        price: 8.10,
        currency: 'USD',
        availability: true,
        lastProviderUpdate: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeded providers, products, and product-provider mappings.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());