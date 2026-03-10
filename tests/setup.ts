/**
 * Jest Test Setup
 * Global configuration and utilities for tests
 */

import { config } from 'dotenv';

// Load environment variables
config();

// Extend Jest timeout for API tests
jest.setTimeout(30000);

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(), // Suppress error logs in tests
  warn: jest.fn(),
};
