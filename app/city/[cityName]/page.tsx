import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { fetchCrimeData, fetchHistoricalCrimeData } from '@/lib/crime-api';
import {
  calculateSafetyScore,
  generateSafetySummary,
} from '@/lib/safety-score';
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

export default async function CityPage({ params }: CityPageProps) {
  const cityName = decodeURIComponent(params.cityName)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Fetch city data
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
    notFound();
  }

  // Fetch crime data
  const crimeData = await fetchCrimeData(city.name);
  const historicalData = await fetchHistoricalCrimeData(city.name, 5);

  // Calculate safety score
  const safetyResult = calculateSafetyScore({
    violentCrimes: crimeData.violentCrime,
    propertyCrimes: crimeData.propertyCrime,
    population: city.population,
  });

  // Generate summary
  const summary = generateSafetySummary(city.name, safetyResult);

  const massAverageScore = 72; // Massachusetts average safety score

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Search Bar */}
        <div className='mb-8'>
          <SearchBar />
        </div>

        {/* City Header */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                {city.name}
              </h1>
              <p className='text-xl text-gray-600'>Massachusetts</p>
              <div className='mt-4 space-y-2'>
                <div className='text-gray-700'>
                  <span className='font-semibold'>County:</span> {city.county}
                </div>
                <div className='text-gray-700'>
                  <span className='font-semibold'>Population:</span>{' '}
                  {city.population.toLocaleString()}
                </div>
                <div className='text-gray-700'>
                  <span className='font-semibold'>Data Year:</span>{' '}
                  {crimeData.year}
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

        {/* Safety Score */}
        <div className='mb-8'>
          <SafetyScore
            score={safetyResult.score}
            rating={safetyResult.rating}
            color={safetyResult.color}
          />
        </div>

        {/* Crime Statistics */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <h2 className='text-2xl font-bold mb-4'>Crime Statistics</h2>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
              <h3 className='text-lg font-semibold text-red-900 mb-2'>
                Violent Crime
              </h3>
              <div className='text-3xl font-bold text-red-600 mb-1'>
                {crimeData.violentCrime.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>
                {safetyResult.violentCrimeRate.toFixed(2)} per 1,000 residents
              </div>
            </div>
            <div className='bg-orange-50 p-4 rounded-lg border border-orange-200'>
              <h3 className='text-lg font-semibold text-orange-900 mb-2'>
                Property Crime
              </h3>
              <div className='text-3xl font-bold text-orange-600 mb-1'>
                {crimeData.propertyCrime.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>
                {safetyResult.propertyCrimeRate.toFixed(2)} per 1,000 residents
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8'>
          <h2 className='text-xl font-semibold text-blue-900 mb-3'>
            Safety Summary
          </h2>
          <p className='text-gray-700 leading-relaxed'>{summary}</p>
        </div>

        {/* Charts */}
        <div className='grid md:grid-cols-2 gap-8 mb-8'>
          <CrimeBreakdownChart
            violentCrime={crimeData.violentCrime}
            propertyCrime={crimeData.propertyCrime}
          />
          <ComparisonChart
            cityScore={safetyResult.score}
            cityName={city.name}
            stateAverage={massAverageScore}
          />
        </div>

        <div className='grid md:grid-cols-2 gap-8 mb-8'>
          <CrimePieChart
            violentCrime={crimeData.violentCrime}
            propertyCrime={crimeData.propertyCrime}
          />
          <CrimeTrendChart data={historicalData} />
        </div>

        {/* Map */}
        <div className='mb-8'>
          <MapView
            latitude={city.latitude}
            longitude={city.longitude}
            cityName={city.name}
          />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CityPageProps) {
  const cityName = decodeURIComponent(params.cityName)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${cityName}, MA Safety Score | MassSafe`,
    description: `View crime statistics and safety scores for ${cityName}, Massachusetts. Make informed decisions about where to live with comprehensive crime data.`,
  };
}
