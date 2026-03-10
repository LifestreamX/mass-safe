/**
 * Integration Test Suite
 * End-to-end workflow validation
 */

import { prisma } from '../lib/prisma';
import { fetchCrimeData } from '../lib/crime-api';
import {
  calculateSafetyScore,
  generateSafetySummary,
} from '../lib/safety-score';

describe('End-to-End Integration Tests', () => {
  test('Complete workflow: Search → Crime Data → Safety Score', async () => {
    // Step 1: Search for a city
    const city = await prisma.city.findFirst({
      where: {
        name: { contains: 'Boston', mode: 'insensitive' },
        state: 'Massachusetts',
      },
    });
    expect(city).not.toBeNull();

    // Step 2: Fetch crime data
    const crimeData = await fetchCrimeData(city!.name, city!.state);
    expect(crimeData).toHaveProperty('violentCrime');
    expect(crimeData).toHaveProperty('propertyCrime');

    // Step 3: Calculate safety score
    const safetyScore = calculateSafetyScore({
      violentCrimes: crimeData.violentCrime,
      propertyCrimes: crimeData.propertyCrime,
      population: city!.population,
    });
    expect(safetyScore.score).toBeGreaterThanOrEqual(0);
    expect(safetyScore.score).toBeLessThanOrEqual(100);

    // Step 4: Generate summary
    const summary = generateSafetySummary(city!.name, safetyScore);
    expect(summary.length).toBeGreaterThan(0);
    expect(summary).toContain(city!.name);
  }, 60000);

  test('Multiple cities complete workflow', async () => {
    const cityNames = ['Boston', 'Cambridge', 'Worcester'];

    for (const cityName of cityNames) {
      const city = await prisma.city.findFirst({
        where: {
          name: { contains: cityName, mode: 'insensitive' },
          state: 'Massachusetts',
        },
      });

      if (city) {
        const crimeData = await fetchCrimeData(city.name, city.state);
        const safetyScore = calculateSafetyScore({
          violentCrimes: crimeData.violentCrime,
          propertyCrimes: crimeData.propertyCrime,
          population: city.population,
        });

        expect(safetyScore.score).toBeGreaterThanOrEqual(0);
        expect(safetyScore.score).toBeLessThanOrEqual(100);
      }
    }
  }, 180000);
});

describe('Error Handling Integration', () => {
  test('Handles missing city gracefully', async () => {
    const city = await prisma.city.findFirst({
      where: {
        name: 'NonexistentCity123456',
        state: 'Massachusetts',
      },
    });
    expect(city).toBeNull();
  });

  test('Handles API failure gracefully', async () => {
    await expect(
      fetchCrimeData('InvalidCity', 'Massachusetts'),
    ).rejects.toThrow();
  });

  test('Safety score handles edge cases', () => {
    const result = calculateSafetyScore({
      violentCrimes: 0,
      propertyCrimes: 0,
      population: 1,
    });
    expect(isNaN(result.score)).toBe(false);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
