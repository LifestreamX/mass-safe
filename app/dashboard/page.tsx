import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CityCard from '@/components/CityCard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/');
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/');
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

  // Calculate colors for safety scores
  const getScoreColor = (score: number | null) => {
    if (!score) return '#64748b';
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#fb923c';
    return '#ef4444';
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Dashboard</h1>
          <p className='text-xl text-gray-600'>
            Welcome back, {session.user.name || 'there'}!
          </p>
        </div>

        {/* Saved Locations */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <h2 className='text-2xl font-bold mb-6'>Saved Locations</h2>

          {savedLocations.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>📍</div>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No saved locations yet
              </h3>
              <p className='text-gray-600 mb-6'>
                Search for Massachusetts cities and save your favorites to track
                safety scores.
              </p>
              <a
                href='/'
                className='inline-block px-6 py-3 bg-primary text-white rounded-lg hover:filter hover:brightness-90 transition'
              >
                Start Searching
              </a>
            </div>
          ) : (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {savedLocations.map((location) => (
                <CityCard
                  key={location.id}
                  id={location.city.id}
                  jurisdiction={location.city.jurisdiction}
                  name={location.city.name}
                  population={location.city.population}
                  crimeRate={location.city.crimeRate}
                  safetyScore={location.safetyScore || undefined}
                  safetyColor={getScoreColor(location.safetyScore)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        {savedLocations.length > 0 && (
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-bold mb-6'>Your Statistics</h2>
            <div className='grid md:grid-cols-3 gap-6'>
              <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                <div className='text-sm text-blue-900 font-semibold mb-1'>
                  Total Saved
                </div>
                <div className='text-3xl font-bold text-blue-600'>
                  {savedLocations.length}
                </div>
                <div className='text-xs text-gray-600 mt-1'>cities</div>
              </div>

              <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                <div className='text-sm text-green-900 font-semibold mb-1'>
                  Average Score
                </div>
                <div className='text-3xl font-bold text-green-600'>
                  {savedLocations.filter((l) => l.safetyScore).length > 0
                    ? (
                        savedLocations.reduce(
                          (sum, l) => sum + (l.safetyScore || 0),
                          0,
                        ) / savedLocations.filter((l) => l.safetyScore).length
                      ).toFixed(1)
                    : 'N/A'}
                </div>
                <div className='text-xs text-gray-600 mt-1'>out of 100</div>
              </div>

              <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
                <div className='text-sm text-purple-900 font-semibold mb-1'>
                  Safest City
                </div>
                <div className='text-xl font-bold text-purple-600'>
                  {savedLocations.filter((l) => l.safetyScore).length > 0
                    ? savedLocations
                        .filter((l) => l.safetyScore)
                        .sort(
                          (a, b) => (b.safetyScore || 0) - (a.safetyScore || 0),
                        )[0].city.name
                    : 'N/A'}
                </div>
                <div className='text-xs text-gray-600 mt-1'>
                  {savedLocations.filter((l) => l.safetyScore).length > 0
                    ? `Score: ${savedLocations
                        .filter((l) => l.safetyScore)
                        .sort(
                          (a, b) => (b.safetyScore || 0) - (a.safetyScore || 0),
                        )[0]
                        .safetyScore?.toFixed(1)}`
                    : ''}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Dashboard | MassSafe',
  description:
    'View and manage your saved Massachusetts cities and safety scores.',
};
