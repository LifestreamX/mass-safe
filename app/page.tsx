import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  // Query top cities by population directly from the database
  const popularCities = await prisma.city.findMany({
    where: {
      population: { gt: 0 }, // Only show cities with population data
    },
    orderBy: { population: 'desc' },
    take: 12,
    select: {
      id: true,
      jurisdiction: true,
      name: true,
      population: true,
      crimeRate: true,
    },
  });
  return (
    <div className='min-h-[calc(100vh-8rem)] bg-gradient-to-br from-gray-50 via-teal-50 to-blue-50 flex flex-col items-center justify-center px-4 z-0'>
      <div className='max-w-6xl w-full text-center'>
        {/* Hero Section */}
        <div className='mb-12 animate-fade-in'>
          <h1 className='text-6xl md:text-7xl font-bold text-gray-900 mb-6'>
            Mass
            <span className='bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent'>
              Safe
            </span>
          </h1>
          <p className='text-2xl md:text-3xl text-gray-700 mb-4 font-medium'>
            Find Safer Places to Live in Massachusetts
          </p>
          <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
            Explore comprehensive crime data, safety scores, and detailed
            statistics for all 474 Massachusetts jurisdictions
          </p>
        </div>

        {/* Search Bar */}
        <div className='mb-16 flex justify-center animate-fade-in-delay'>
          <SearchBar placeholder='Search for a city, town, or university...' />
        </div>

        {/* Popular Searches */}
        <div className='mb-12'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3'>
            <span className='text-3xl'>🌆</span>
            Popular Locations
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-10'>
            {popularCities.map((city: any) => (
              <Link
                key={city.id}
                href={`/city/${encodeURIComponent(city.jurisdiction)}`}
                className='group bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              >
                <div className='font-bold text-lg text-gray-900 group-hover:text-primary mb-2'>
                  {city.name}
                </div>
                <div className='text-sm text-gray-500 mb-1'>
                  Pop: {city.population.toLocaleString()}
                </div>
                {city.crimeRate && (
                  <div className='text-xs text-gray-400'>
                    Crime Rate: {city.crimeRate.toFixed(0)}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className='grid md:grid-cols-3 gap-8 mt-16'>
          <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow'>
            <div className='w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-4 mx-auto'>
              <span className='text-4xl'>📊</span>
            </div>
            <h3 className='font-bold text-xl mb-3 text-gray-900'>
              Comprehensive Crime Data
            </h3>
            <p className='text-gray-600'>
              Access detailed statistics including total crimes, clearance
              rates, arrests, and crime rates per 100k population for every
              jurisdiction
            </p>
          </div>
          <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow'>
            <div className='w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 mx-auto'>
              <span className='text-4xl'>🎯</span>
            </div>
            <h3 className='font-bold text-xl mb-3 text-gray-900'>
              Real Safety Scores
            </h3>
            <p className='text-gray-600'>
              Get instant safety ratings from 0-100 calculated from actual
              Massachusetts state crime data from 2024
            </p>
          </div>
          <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow'>
            <div className='w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 mx-auto'>
              <span className='text-4xl'>🗺️</span>
            </div>
            <h3 className='font-bold text-xl mb-3 text-gray-900'>
              Visual Analytics
            </h3>
            <p className='text-gray-600'>
              Explore interactive charts, graphs, and maps to understand crime
              trends and compare different locations
            </p>
          </div>
        </div>

        {/* Stats Banner */}
        <div className='mt-16 bg-gradient-to-r from-primary to-teal-600 rounded-2xl p-8 text-white shadow-2xl'>
          <div className='grid grid-cols-3 gap-8 text-center'>
            <div>
              <div className='text-5xl font-bold mb-2'>474</div>
              <div className='text-sm opacity-90'>Jurisdictions</div>
            </div>
            <div>
              <div className='text-5xl font-bold mb-2'>2024</div>
              <div className='text-sm opacity-90'>Latest Data</div>
            </div>
            <div>
              <div className='text-5xl font-bold mb-2'>100%</div>
              <div className='text-sm opacity-90'>Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
