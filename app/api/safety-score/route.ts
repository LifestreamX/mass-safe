import { NextRequest, NextResponse } from 'next/server';
import { calculateSafetyScore } from '@/lib/safety-score';

/**
 * POST /api/safety-score
 * Calculate safety score from crime statistics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { violentCrimes, propertyCrimes, population } = body;

    if (
      typeof violentCrimes !== 'number' ||
      typeof propertyCrimes !== 'number' ||
      typeof population !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 },
      );
    }

    const result = calculateSafetyScore({
      violentCrimes,
      propertyCrimes,
      population,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Safety score calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate safety score' },
      { status: 500 },
    );
  }
}
