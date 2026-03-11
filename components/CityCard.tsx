'use client';

import Link from 'next/link';

interface CityCardProps {
  id: string;
  jurisdiction: string;
  name: string;
  population: number;
  crimeRate?: number | null;
  safetyScore?: number;
  safetyColor?: string;
}

export default function CityCard({
  id,
  jurisdiction,
  name,
  population,
  crimeRate,
  safetyScore,
  safetyColor,
}: CityCardProps) {
  return (
    <Link href={`/city/${jurisdiction}`}>
      <div className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border-2 border-gray-200 hover:border-primary hover:-translate-y-1 z-10'>
        <h3 className='text-2xl font-bold mb-3 text-gray-900'>{name}</h3>
        <div className='text-gray-600 mb-4 space-y-1'>
          <div className='flex items-center gap-2'>
            <span className='text-lg'>👥</span>
            <span>
              Population: {population > 0 ? population.toLocaleString() : 'N/A'}
            </span>
          </div>
          {crimeRate !== null && crimeRate !== undefined && (
            <div className='flex items-center gap-2'>
              <span className='text-lg'>📊</span>
              <span>Crime Rate: {crimeRate.toFixed(2)}</span>
            </div>
          )}
        </div>

        {safetyScore !== undefined && (
          <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
            <span className='text-sm font-semibold text-gray-700'>
              Safety Score
            </span>
            <div className='flex items-center'>
              <span
                className='text-3xl font-bold mr-2'
                style={{ color: safetyColor }}
              >
                {safetyScore.toFixed(1)}
              </span>
              <span className='text-gray-400 text-lg'>/100</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
