// Ensure this route is always dynamic (never statically generated)
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchCrimeData } from '@/lib/crime-api';

/**
 * GET /api/crime-data?city=cityName
 * Fetch crime data for a specific city
 * Uses cache if available, otherwise fetches from FBI API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cityName = searchParams.get('city');

    if (!cityName) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 },
      );
    }

    // Find the city
    const city = await prisma.city.findFirst({
      where: {
        name: {
          equals: cityName,
          mode: 'insensitive',
        },
        state: 'Massachusetts',
      },
    });

    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const currentYear = new Date().getFullYear() - 1;

    // Check cache first
    let crimeCache = await prisma.crimeCache.findFirst({
      where: {
        cityId: city.id,
        year: currentYear,
      },
    });

    // If cache exists and is recent (less than 30 days old)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (crimeCache && crimeCache.updatedAt > thirtyDaysAgo) {
      return NextResponse.json({
        violentCrime: crimeCache.violentCrime,
        propertyCrime: crimeCache.propertyCrime,
        year: crimeCache.year,
        cached: true,
        source: 'cache',
      });
    }

    // Fetch from FBI API (pass population so mock fallback can estimate)
    const crimeData = await fetchCrimeData(
      city.name,
      'Massachusetts',
      city.population ?? undefined,
    );

    // Update or create cache
    crimeCache = await prisma.crimeCache.upsert({
      where: {
        cityId_year: {
          cityId: city.id,
          year: crimeData.year,
        },
      },
      update: {
        violentCrime: crimeData.violentCrime,
        propertyCrime: crimeData.propertyCrime,
        updatedAt: new Date(),
      },
      create: {
        cityId: city.id,
        violentCrime: crimeData.violentCrime,
        propertyCrime: crimeData.propertyCrime,
        year: crimeData.year,
      },
    });

    return NextResponse.json({
      violentCrime: crimeCache.violentCrime,
      propertyCrime: crimeCache.propertyCrime,
      year: crimeCache.year,
      cached: false,
      source: crimeData?.source ?? 'fbi',
    });
  } catch (error: any) {
    console.error('Crime data fetch error:', error);
    // If the error is due to FBI API or missing data, return a 503 with the error message
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch FBI data', source: 'error' },
      { status: 503 },
    );
  }
}
