import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/city-details?jurisdiction=slug
 * Get detailed information about a specific city/jurisdiction
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jurisdiction = searchParams.get('jurisdiction');

    if (!jurisdiction) {
      return NextResponse.json(
        { error: 'Jurisdiction parameter is required' },
        { status: 400 },
      );
    }

    const city = await prisma.city.findUnique({
      where: {
        jurisdiction: jurisdiction.toLowerCase(),
      },
      include: {
        crimeCache: {
          orderBy: {
            year: 'desc',
          },
          take: 5, // Get last 5 years if available
        },
      },
    });

    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json(city);
  } catch (error) {
    console.error('City details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch city details' },
      { status: 500 },
    );
  }
}
