'use client';

interface SafetyScoreProps {
  score: number;
  rating: string;
  color: string;
  showLabel?: boolean;
}

export default function SafetyScore({
  score,
  rating,
  color,
  showLabel = true,
}: SafetyScoreProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-xl font-semibold mb-4'>Safety Score</h3>

      <div className='flex items-center justify-center mb-4'>
        <div className='text-6xl font-bold' style={{ color }}>
          {score.toFixed(1)}
        </div>
        <div className='text-2xl text-gray-400 ml-2'>/100</div>
      </div>

      {showLabel && (
        <div className='text-center mb-4'>
          <span
            className='inline-block px-4 py-2 rounded-full text-white font-semibold uppercase text-sm'
            style={{ backgroundColor: color }}
          >
            {rating}
          </span>
        </div>
      )}

      <div className='w-full bg-gray-200 rounded-full h-4 overflow-hidden'>
        <div
          className='h-full rounded-full transition-all duration-500'
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <div className='mt-4 text-sm text-gray-600 text-center'>
        Based on violent and property crime rates
      </div>
    </div>
  );
}
