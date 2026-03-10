'use client';

import Link from 'next/link';

interface CityCardProps {
  id: string;
  name: string;
  county: string;
  population: number;
  safetyScore?: number;
  safetyColor?: string;
}

export default function CityCard({
  id,
  name,
  county,
  population,
  safetyScore,
  safetyColor,
}: CityCardProps) {
  return (
    <Link href={`/city/${name.toLowerCase()}`}>
      <div className='bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 cursor-pointer border border-gray-200 hover:border-primary'>
        <h3 className='text-2xl font-bold mb-2'>{name}</h3>
        <div className='text-gray-600 mb-4'>
          <div>{county} County</div>
          <div>Population: {population.toLocaleString()}</div>
        </div>

        {safetyScore !== undefined && (
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>Safety Score</span>
            <div className='flex items-center'>
              <span
                className='text-2xl font-bold mr-2'
                style={{ color: safetyColor }}
              >
                {safetyScore.toFixed(1)}
              </span>
              <span className='text-gray-400'>/100</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
