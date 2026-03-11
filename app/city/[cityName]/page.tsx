import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SafetyScore from '@/components/SafetyScore';
import {
  CrimeBreakdownChart,
  CrimeTrendChart,
  ComparisonChart,
  CrimePieChart,
} from '@/components/Charts';
import MapView from '@/components/MapView';
import SaveButton from '@/components/SaveButton';
import SearchBar from '@/components/SearchBar';

interface CityPageProps {
  params: {
    cityName: string;
  };
}

// Calculate safety score from crime data
function calculateSafetyScore(crimeRate: number | null, population: number) {
  if (!crimeRate || population === 0) {
    return {
      score: 50,
      rating: 'Unknown',
      color: 'gray',
    };
  }

  // Score calculation: Lower crime rate = higher score
  // Average MA crime rate is ~3455 per 100k
  const massAvgRate = 3455.62;
  const relativeRate = (crimeRate / massAvgRate) * 100;

  // Invert so lower crime = higher score, cap at 0-100
  let score = Math.max(0, Math.min(100, 100 - relativeRate + 50));

  let rating = '';
  let color = '';

  if (score >= 80) {
    rating = 'Very Safe';
    color = 'green';
  } else if (score >= 65) {
    rating = 'Safe';
    color = 'teal';
  } else if (score >= 50) {
    rating = 'Moderate';
    color = 'yellow';
  } else if (score >= 35) {
    rating = 'Below Average';
    color = 'orange';
  } else {
    rating = 'High Crime';
    color = 'red';
  }

  return { score: Math.round(score), rating, color };
}

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = (await params) as { cityName: string };
  const jurisdiction = decodeURIComponent(resolvedParams.cityName);

  // Fetch city data by jurisdiction (case-insensitive)
  const city = await prisma.city.findFirst({
    where: {
      jurisdiction: {
        equals: jurisdiction,
        mode: 'insensitive',
      },
    },
  });

  if (!city) {
    notFound();
  }

  // Calculate safety score from our data
  const safetyResult = calculateSafetyScore(city.crimeRate, city.population);

  return (
    <div className='bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Search Bar */}
        <div className='mb-8 flex justify-center'>
          <div className='w-full max-w-2xl'>
            <SearchBar />
          </div>
        </div>

        {/* City Header */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200'>
          <div className='flex justify-between items-start flex-wrap gap-4'>
            <div className='flex-1'>
              <h1 className='text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent'>
                {city.name}
              </h1>
              <p className='text-2xl text-gray-600 mb-6'>Massachusetts</p>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
                <div className='flex items-center gap-3 bg-gray-50 p-4 rounded-lg'>
                  <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                    <span className='text-xl'>👥</span>
                  </div>
                  <div>
                    <div className='text-sm text-gray-500 font-medium'>
                      Population
                    </div>
                    <div className='text-xl font-bold text-gray-900'>
                      {city.population > 0
                        ? city.population.toLocaleString()
                        : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3 bg-gray-50 p-4 rounded-lg'>
                  <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
                    <span className='text-xl'>🚨</span>
                  </div>
                  <div>
                    <div className='text-sm text-gray-500 font-medium'>
                      Total Crimes
                    </div>
                    <div className='text-xl font-bold text-gray-900'>
                      {city.crimesTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3 bg-gray-50 p-4 rounded-lg'>
                  <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center'>
                    <span className='text-xl'>📊</span>
                  </div>
                  <div>
                    <div className='text-sm text-gray-500 font-medium'>
                      Crime Rate
                    </div>
                    <div className='text-xl font-bold text-gray-900'>
                      {city.crimeRate ? city.crimeRate.toFixed(2) : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3 bg-gray-50 p-4 rounded-lg'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-xl'>📅</span>
                  </div>
                  <div>
                    <div className='text-sm text-gray-500 font-medium'>
                      Data Year
                    </div>
                    <div className='text-xl font-bold text-gray-900'>
                      {city.year}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <SaveButton
                cityId={city.id}
                cityName={city.name}
                safetyScore={safetyResult.score}
              />
            </div>
          </div>
        </div>

        {/* Map */}
        {city.latitude != null && city.longitude != null && (
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mb-8'>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>Location</h3>
            <MapView
              latitude={city.latitude}
              longitude={city.longitude}
              cityName={city.name}
            />
          </div>
        )}

        {/* Safety Score */}
        <div className='mb-8'>
          <SafetyScore
            score={safetyResult.score}
            rating={safetyResult.rating}
            color={safetyResult.color}
          />
        </div>

        {/* Crime Statistics Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200 shadow-lg'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-12 h-12 bg-red-500 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>🚨</span>
              </div>
              <h3 className='text-lg font-bold text-red-900'>Total Crimes</h3>
            </div>
            <div className='text-4xl font-bold text-red-700 mb-2'>
              {city.crimesTotal.toLocaleString()}
            </div>
            <div className='text-sm text-red-600'>Reported in {city.year}</div>
          </div>

          <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 shadow-lg'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>✓</span>
              </div>
              <h3 className='text-lg font-bold text-blue-900'>
                Clearance Rate
              </h3>
            </div>
            <div className='text-4xl font-bold text-blue-700 mb-2'>
              {city.crimesClearanceRate
                ? `${city.crimesClearanceRate.toFixed(1)}%`
                : 'N/A'}
            </div>
            <div className='text-sm text-blue-600'>Cases solved/cleared</div>
          </div>

          <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 shadow-lg'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>👮</span>
              </div>
              <h3 className='text-lg font-bold text-purple-900'>
                Total Arrests
              </h3>
            </div>
            <div className='text-4xl font-bold text-purple-700 mb-2'>
              {city.arrestsTotal.toLocaleString()}
            </div>
            <div className='text-sm text-purple-600'>
              Arrests made in {city.year}
            </div>
          </div>

          <div className='bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200 shadow-lg'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>📈</span>
              </div>
              <h3 className='text-lg font-bold text-orange-900'>Arrest Rate</h3>
            </div>
            <div className='text-4xl font-bold text-orange-700 mb-2'>
              {city.arrestRate ? city.arrestRate.toFixed(1) : 'N/A'}
            </div>
            <div className='text-sm text-orange-600'>Per 100k residents</div>
          </div>
        </div>

        {/* Summary Card */}
        <div className='bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 mb-8 shadow-lg'>
          <h2 className='text-2xl font-bold text-blue-900 mb-4 flex items-center gap-3'>
            <span className='text-3xl'>📋</span>
            Safety Overview
          </h2>
          <p className='text-gray-700 leading-relaxed text-lg'>
            {city.name} has a safety score of{' '}
            <strong>{safetyResult.score}/100</strong>, classified as{' '}
            <strong className={`text-${safetyResult.color}-600`}>
              {safetyResult.rating}
            </strong>
            .{' '}
            {city.crimeRate &&
              `With a crime rate of ${city.crimeRate.toFixed(2)} per 100,000 residents, `}
            the jurisdiction reported {city.crimesTotal.toLocaleString()} total
            crimes in {city.year}.
            {city.crimesClearanceRate &&
              ` Law enforcement achieved a ${city.crimesClearanceRate.toFixed(1)}% clearance rate.`}
            {city.arrestRate &&
              ` The arrest rate was ${city.arrestRate.toFixed(1)} per 100,000 population.`}
          </p>
        </div>

        {/* Charts */}
        <div className='grid md:grid-cols-2 gap-8 mb-8'>
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-200'>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>
              Crime Overview
            </h3>
            <CrimeBreakdownChart
              violentCrime={Math.round(city.crimesTotal * 0.15)} // Estimate
              propertyCrime={Math.round(city.crimesTotal * 0.85)} // Estimate
            />
          </div>
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-200'>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>
              Safety Comparison
            </h3>
            <ComparisonChart
              cityScore={safetyResult.score}
              cityName={city.name}
              stateAverage={72}
            />
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-8 mb-8'>
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-200'>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>
              Crime Distribution
            </h3>
            <CrimePieChart
              violentCrime={Math.round(city.crimesTotal * 0.15)}
              propertyCrime={Math.round(city.crimesTotal * 0.85)}
            />
          </div>
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-200'>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>
              Historical Trends
            </h3>
            <CrimeTrendChart
              data={[
                {
                  year: parseInt(city.year),
                  violentCrime: Math.round(city.crimesTotal * 0.15),
                  propertyCrime: Math.round(city.crimesTotal * 0.85),
                },
              ]}
            />
          </div>
        </div>

        {/* Map */}
        {city.latitude != null && city.longitude != null && (
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mb-8'>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>Location</h3>
            <MapView
              latitude={city.latitude}
              longitude={city.longitude}
              cityName={city.name}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CityPageProps) {
  const resolvedParams = (await params) as { cityName: string };
  const jurisdiction = decodeURIComponent(resolvedParams.cityName);

  const city = await prisma.city.findFirst({
    where: {
      jurisdiction: {
        equals: jurisdiction,
        mode: 'insensitive',
      },
    },
    select: { name: true },
  });

  const cityName = city?.name || 'Unknown';

  return {
    title: `${cityName}, MA Safety Score | MassSafe`,
    description: `View crime statistics and safety scores for ${cityName}, Massachusetts. Make informed decisions about where to live with comprehensive crime data.`,
  };
}
