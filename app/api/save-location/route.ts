import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/save-location
 * Save a location for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { cityId, safetyScore } = body;

    if (!cityId) {
      return NextResponse.json(
        { error: 'City ID is required' },
        { status: 400 },
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create saved location
    const savedLocation = await prisma.savedLocation.create({
      data: {
        userId: user.id,
        cityId,
        safetyScore: safetyScore || null,
      },
      include: {
        city: true,
      },
    });

    return NextResponse.json(savedLocation);
  } catch (error: any) {
    console.error('Save location error:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Location already saved' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to save location' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/save-location?id=locationId&cityId=cityId
 * Remove a saved location
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get('id');
    const cityId = searchParams.get('cityId');

    if (!locationId && !cityId) {
      return NextResponse.json(
        { error: 'Location ID or City ID is required' },
        { status: 400 },
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete saved location (if it belongs to the user)
    await prisma.savedLocation.deleteMany({
      where: {
        userId: user.id,
        ...(locationId ? { id: locationId } : { cityId: cityId }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete saved location error:', error);
    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/save-location
 * Get all saved locations for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get saved locations
    const savedLocations = await prisma.savedLocation.findMany({
      where: {
        userId: user.id,
      },
      include: {
        city: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(savedLocations);
  } catch (error) {
    console.error('Get saved locations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved locations' },
      { status: 500 },
    );
  }
}
