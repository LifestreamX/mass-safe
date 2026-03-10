/**
 * Database Connection and Operations Test
 * Validates Prisma connection, schema, and CRUD operations
 */

import { prisma } from '../lib/prisma';

describe('Database Connection', () => {
  test('Prisma client connects successfully', async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  test('Can query City table', async () => {
    const cities = await prisma.city.findMany({ take: 5 });
    expect(Array.isArray(cities)).toBe(true);
  });

  test('City table has required fields', async () => {
    const city = await prisma.city.findFirst();
    if (city) {
      expect(city).toHaveProperty('id');
      expect(city).toHaveProperty('name');
      expect(city).toHaveProperty('state');
      expect(city).toHaveProperty('population');
      expect(city).toHaveProperty('latitude');
      expect(city).toHaveProperty('longitude');
    }
  });

  test('Can perform insert operation', async () => {
    const testCity = await prisma.city.upsert({
      where: {
        name_state: {
          name: 'Test City',
          state: 'Massachusetts',
        },
      },
      update: {},
      create: {
        name: 'Test City',
        state: 'Massachusetts',
        county: 'Test County',
        population: 50000,
        latitude: 42.3601,
        longitude: -71.0589,
      },
    });
    expect(testCity.name).toBe('Test City');
  });

  test('Can delete test data', async () => {
    await prisma.city.deleteMany({
      where: { name: 'Test City' },
    });
    const deleted = await prisma.city.findFirst({
      where: { name: 'Test City' },
    });
    expect(deleted).toBeNull();
  });
});

describe('Database Stress Test', () => {
  test('Can handle 100 concurrent reads', async () => {
    const promises = Array.from({ length: 100 }, () =>
      prisma.city.findMany({ take: 10 }),
    );
    const results = await Promise.all(promises);
    expect(results.length).toBe(100);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
