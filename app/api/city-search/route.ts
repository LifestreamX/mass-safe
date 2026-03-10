import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/city-search?q=query
 * Search for Massachusetts cities with autocomplete
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const cities = await prisma.city.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
        state: 'Massachusetts',
      },
      select: {
        id: true,
        name: true,
        county: true,
        population: true,
      },
      take: 10,
      orderBy: {
        population: 'desc',
      },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error('City search error:', error);
    return NextResponse.json(
      { error: 'Failed to search cities' },
      { status: 500 },
    );
  }
}
