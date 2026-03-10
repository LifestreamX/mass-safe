/**
 * FBI Crime Data API Test
 * Validates API connectivity, authentication, and data parsing
 */

import { fetchCrimeData } from '../lib/crime-api';

describe('FBI Crime Data API', () => {
  test('API key is configured', () => {
    expect(process.env.FBI_API_KEY).toBeDefined();
  });

  test('Can fetch crime data for Massachusetts', async () => {
    const data = await fetchCrimeData('Boston', 'Massachusetts');
    expect(data).toHaveProperty('violentCrime');
    expect(data).toHaveProperty('propertyCrime');
    expect(data).toHaveProperty('year');
    expect(typeof data.violentCrime).toBe('number');
    expect(typeof data.propertyCrime).toBe('number');
  }, 30000);

  test('Returns valid year data', async () => {
    const data = await fetchCrimeData('Cambridge', 'Massachusetts');
    const currentYear = new Date().getFullYear();
    expect(data.year).toBeGreaterThan(2020);
    expect(data.year).toBeLessThanOrEqual(currentYear);
  }, 30000);

  test('Crime numbers are non-negative', async () => {
    const data = await fetchCrimeData('Worcester', 'Massachusetts');
    expect(data.violentCrime).toBeGreaterThanOrEqual(0);
    expect(data.propertyCrime).toBeGreaterThanOrEqual(0);
  }, 30000);

  test('Handles API errors gracefully', async () => {
    await expect(
      fetchCrimeData('NonexistentCity123456', 'Massachusetts'),
    ).rejects.toThrow();
  }, 30000);
});

describe('FBI API Stress Test', () => {
  const testCities = [
    'Boston',
    'Cambridge',
    'Worcester',
    'Springfield',
    'Lowell',
  ];

  test('Can handle multiple sequential requests', async () => {
    for (const city of testCities) {
      const data = await fetchCrimeData(city, 'Massachusetts');
      expect(data).toHaveProperty('violentCrime');
      expect(data).toHaveProperty('propertyCrime');
    }
  }, 120000);

  test('Can handle concurrent requests', async () => {
    const promises = testCities.map((city) =>
      fetchCrimeData(city, 'Massachusetts'),
    );
    const results = await Promise.all(promises);
    expect(results.length).toBe(testCities.length);
    results.forEach((data) => {
      expect(data).toHaveProperty('violentCrime');
      expect(data).toHaveProperty('propertyCrime');
    });
  }, 120000);
});
