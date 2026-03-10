import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/city-list
 * Returns all Massachusetts cities/towns/places
 */
export async function GET(request: NextRequest) {
  try {
    const cities = await prisma.city.findMany({
      where: { state: 'Massachusetts' },
      select: {
        id: true,
        name: true,
        county: true,
        // population: true, // removed
        latitude: true,
        longitude: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(cities);
  } catch (error) {
    console.error('City list error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
