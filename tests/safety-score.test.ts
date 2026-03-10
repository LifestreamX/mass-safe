/**
 * Safety Score Calculation Test
 * Validates safety score algorithm and edge cases
 */

import { calculateSafetyScore } from '../lib/safety-score';

describe('Safety Score Calculation', () => {
  test('Returns valid score object', () => {
    const result = calculateSafetyScore({
      violentCrimes: 100,
      propertyCrimes: 500,
      population: 50000,
    });

    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('color');
    expect(result).toHaveProperty('violentCrimeRate');
    expect(result).toHaveProperty('propertyCrimeRate');
  });

  test('Score is between 0 and 100', () => {
    const result = calculateSafetyScore({
      violentCrimes: 100,
      propertyCrimes: 500,
      population: 50000,
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('Higher crime results in lower score', () => {
    const lowCrime = calculateSafetyScore({
      violentCrimes: 10,
      propertyCrimes: 50,
      population: 50000,
    });

    const highCrime = calculateSafetyScore({
      violentCrimes: 1000,
      propertyCrimes: 5000,
      population: 50000,
    });

    expect(lowCrime.score).toBeGreaterThan(highCrime.score);
  });

  test('Handles zero crime correctly', () => {
    const result = calculateSafetyScore({
      violentCrimes: 0,
      propertyCrimes: 0,
      population: 50000,
    });
    expect(result.score).toBe(100);
    expect(result.rating).toBe('Excellent');
  });

  test('Handles small population correctly', () => {
    const result = calculateSafetyScore({
      violentCrimes: 1,
      propertyCrimes: 5,
      population: 100,
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(isNaN(result.score)).toBe(false);
  });

  test('Never returns NaN', () => {
    const testCases = [
      { violentCrimes: 0, propertyCrimes: 0, population: 1 },
      { violentCrimes: 1, propertyCrimes: 1, population: 1 },
      { violentCrimes: 100, propertyCrimes: 500, population: 100000 },
      { violentCrimes: 10000, propertyCrimes: 50000, population: 500000 },
    ];

    testCases.forEach((testCase) => {
      const result = calculateSafetyScore(testCase);
      expect(isNaN(result.score)).toBe(false);
      expect(isNaN(result.violentCrimeRate)).toBe(false);
      expect(isNaN(result.propertyCrimeRate)).toBe(false);
    });
  });

  test('Rating matches score range', () => {
    const excellent = calculateSafetyScore({
      violentCrimes: 1,
      propertyCrimes: 5,
      population: 100000,
    });
    expect(excellent.rating).toBe('Excellent');

    const poor = calculateSafetyScore({
      violentCrimes: 5000,
      propertyCrimes: 25000,
      population: 100000,
    });
    expect(['Poor', 'Very Poor']).toContain(poor.rating);
  });

  test('Crime rates calculated correctly', () => {
    const result = calculateSafetyScore({
      violentCrimes: 100,
      propertyCrimes: 500,
      population: 100000,
    });
    expect(result.violentCrimeRate).toBeCloseTo(1.0, 1);
    expect(result.propertyCrimeRate).toBeCloseTo(5.0, 1);
  });
});

describe('Safety Score Stress Test', () => {
  test('Can handle 1000 calculations', () => {
    for (let i = 0; i < 1000; i++) {
      const result = calculateSafetyScore({
        violentCrimes: Math.floor(Math.random() * 1000),
        propertyCrimes: Math.floor(Math.random() * 5000),
        population: Math.floor(Math.random() * 100000) + 1000,
      });
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(isNaN(result.score)).toBe(false);
    }
  });
});
