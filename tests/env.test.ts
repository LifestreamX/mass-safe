/**
 * Environment Variables Verification Test
 * Validates all required environment variables are present
 */

import { config } from 'dotenv';

config();

describe('Environment Variables', () => {
  test('DATABASE_URL is defined', () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.DATABASE_URL).toContain('postgresql://');
  });

  test('NEXTAUTH_URL is defined', () => {
    expect(process.env.NEXTAUTH_URL).toBeDefined();
  });

  test('NEXTAUTH_SECRET is defined', () => {
    expect(process.env.NEXTAUTH_SECRET).toBeDefined();
    expect(process.env.NEXTAUTH_SECRET!.length).toBeGreaterThan(20);
  });

  test('GOOGLE_CLIENT_ID is defined', () => {
    expect(process.env.GOOGLE_CLIENT_ID).toBeDefined();
  });

  test('GOOGLE_CLIENT_SECRET is defined', () => {
    expect(process.env.GOOGLE_CLIENT_SECRET).toBeDefined();
  });

  test('FBI_API_KEY is defined', () => {
    expect(process.env.FBI_API_KEY).toBeDefined();
    expect(process.env.FBI_API_KEY!.length).toBeGreaterThan(10);
  });
});
