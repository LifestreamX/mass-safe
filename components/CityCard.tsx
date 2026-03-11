'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CityCardProps {
  id: string;
  jurisdiction: string;
  name: string;
  population: number;
  crimeRate?: number | null;
  safetyScore?: number;
  safetyColor?: string;
  showRemove?: boolean;
}

export default function CityCard({
  id,
  jurisdiction,
  name,
  population,
  crimeRate,
  safetyScore,
  safetyColor,
  showRemove = false,
}: CityCardProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setShowConfirmModal(true);
  };

  const confirmRemove = async () => {
    setShowConfirmModal(false);
    setIsRemoving(true);
    try {
      const response = await fetch(`/api/save-location?cityId=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to remove location');
      }
    } catch (error) {
      console.error('Error removing location:', error);
      alert('An error occurred while removing the location');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <Link href={`/city/${jurisdiction}`}>
        <div
          className={`relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border-2 border-gray-200 hover:border-primary hover:-translate-y-1 z-10 ${isRemoving ? 'opacity-50 grayscale pointer-events-none' : ''}`}
        >
          {showRemove && (
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className='absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-colors border border-red-100 shadow-sm'
              title='Remove from saved'
            >
              <span className='text-xl leading-none'>×</span>
            </button>
          )}
          <h3 className='text-2xl font-bold mb-3 text-gray-900 pr-8'>{name}</h3>
          <div className='text-gray-600 mb-4 space-y-1'>
            <div className='flex items-center gap-2'>
              <span className='text-lg'>👥</span>
              <span>
                Population:{' '}
                {population > 0 ? population.toLocaleString() : 'N/A'}
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

      {/* Modern Confirmation Modal */}
      {showConfirmModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-in zoom-in-95 duration-200'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl'>⚠️</span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                Remove {name}?
              </h3>
              <p className='text-gray-600 mb-6'>
                Are you sure you want to remove this city from your saved
                locations list?
              </p>
              <div className='flex gap-3'>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className='flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className='flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200'
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
