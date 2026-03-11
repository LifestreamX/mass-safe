import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/city-search?q=query
 * Search for Massachusetts jurisdictions with autocomplete
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const jurisdictions = await prisma.city.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            jurisdiction: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        jurisdiction: true,
        name: true,
        population: true,
        crimeRate: true,
        crimesTotal: true,
      },
      take: 10,
      orderBy: [
        {
          population: 'desc', // Show more populous areas first
        },
        {
          name: 'asc',
        },
      ],
    });

    return NextResponse.json(jurisdictions);
  } catch (error) {
    console.error('City search error:', error);
    return NextResponse.json(
      { error: 'Failed to search cities' },
      { status: 500 },
    );
  }
}
