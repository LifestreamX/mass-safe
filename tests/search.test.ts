/**
 * City Search Functionality Test
 * Validates search API and query handling
 */

import { prisma } from '../lib/prisma';

describe('City Search', () => {
  test('Can find Boston', async () => {
    const result = await prisma.city.findFirst({
      where: {
        name: { contains: 'Boston', mode: 'insensitive' },
        state: 'Massachusetts',
      },
    });
    expect(result).not.toBeNull();
    expect(result?.name).toContain('Boston');
  });

  test('Can find Cambridge', async () => {
    const result = await prisma.city.findFirst({
      where: {
        name: { contains: 'Cambridge', mode: 'insensitive' },
        state: 'Massachusetts',
      },
    });
    expect(result).not.toBeNull();
    expect(result?.name).toBe('Cambridge');
  });

  test('Search is case-insensitive', async () => {
    const lower = await prisma.city.findMany({
      where: {
        name: { contains: 'boston', mode: 'insensitive' },
        state: 'Massachusetts',
      },
    });
    const upper = await prisma.city.findMany({
      where: {
        name: { contains: 'BOSTON', mode: 'insensitive' },
        state: 'Massachusetts',
      },
    });
    expect(lower.length).toBe(upper.length);
  });

  test('Returns multiple results for partial match', async () => {
    const results = await prisma.city.findMany({
      where: {
        name: { contains: 'Spring', mode: 'insensitive' },
        state: 'Massachusetts',
      },
    });
    expect(results.length).toBeGreaterThan(0);
  });

  test('Returns empty array for invalid search', async () => {
    const results = await prisma.city.findMany({
      where: {
        name: { contains: 'XYZ123InvalidCity', mode: 'insensitive' },
        state: 'Massachusetts',
      },
    });
    expect(results.length).toBe(0);
  });

  test('Results are ordered by population', async () => {
    const results = await prisma.city.findMany({
      where: {
        name: { contains: '', mode: 'insensitive' },
        state: 'Massachusetts',
      },
      orderBy: { population: 'desc' },
      take: 10,
    });
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].population).toBeGreaterThanOrEqual(
        results[i + 1].population,
      );
    }
  });
});

describe('Search Stress Test', () => {
  const testQueries = [
    'Boston',
    'Cambridge',
    'Worcester',
    'Springfield',
    'Lowell',
    'Quincy',
    'Newton',
    'Somerville',
    'Lynn',
    'Lawrence',
  ];

  test('Can handle 100 search queries', async () => {
    const promises = Array.from({ length: 100 }, (_, i) =>
      prisma.city.findMany({
        where: {
          name: {
            contains: testQueries[i % testQueries.length],
            mode: 'insensitive',
          },
          state: 'Massachusetts',
        },
        take: 10,
      }),
    );
    const results = await Promise.all(promises);
    expect(results.length).toBe(100);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
