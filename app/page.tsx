import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

const popularCities = [
  { name: 'Boston', href: '/city/boston' },
  { name: 'Cambridge', href: '/city/cambridge' },
  { name: 'Quincy', href: '/city/quincy' },
  { name: 'Somerville', href: '/city/somerville' },
  { name: 'Salem', href: '/city/salem' },
];

export default function HomePage() {
  return (
    <div className='min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4'>
      <div className='max-w-4xl w-full text-center'>
        {/* Hero Section */}
        <div className='mb-12'>
          <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-4'>
            Mass<span className='text-primary'>Safe</span>
          </h1>
          <p className='text-xl md:text-2xl text-gray-600 mb-8'>
            Find safer places to live in Massachusetts
          </p>
        </div>

        {/* Search Bar */}
        <div className='mb-12 flex justify-center'>
          <SearchBar placeholder='Search Massachusetts cities or ZIP codes' />
        </div>

        {/* Popular Searches */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold text-gray-700 mb-4'>
            Popular Searches
          </h2>
          <div className='flex flex-wrap justify-center gap-3'>
            {popularCities.map((city) => (
              <Link
                key={city.name}
                href={city.href}
                className='px-6 py-3 bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition shadow-sm'
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className='grid md:grid-cols-3 gap-6 mt-12 text-left'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='text-3xl mb-3'>📊</div>
            <h3 className='font-semibold text-lg mb-2'>Crime Statistics</h3>
            <p className='text-gray-600 text-sm'>
              View detailed violent and property crime data for any
              Massachusetts city
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='text-3xl mb-3'>🎯</div>
            <h3 className='font-semibold text-lg mb-2'>Safety Scores</h3>
            <p className='text-gray-600 text-sm'>
              Get an instant safety rating from 0-100 based on crime rates
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='text-3xl mb-3'>🗺️</div>
            <h3 className='font-semibold text-lg mb-2'>Map Visualization</h3>
            <p className='text-gray-600 text-sm'>
              Explore cities with interactive maps and location data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
