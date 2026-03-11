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
  // Map simple color names to accessible high-contrast values
  const accessibleColors: Record<
    string,
    { bg: string; text: string; bar: string }
  > = {
    green: { bg: '#dcfce7', text: '#166534', bar: '#22c55e' }, // Emerald-100/800
    teal: { bg: '#ccfbf1', text: '#115e59', bar: '#14b8a6' }, // Teal-100/800
    yellow: { bg: '#fef9c3', text: '#854d0e', bar: '#eab308' }, // Yellow-100/800 (Darker text)
    orange: { bg: '#ffedd5', text: '#9a3412', bar: '#f97316' }, // Orange-100/800
    red: { bg: '#fee2e2', text: '#991b1b', bar: '#ef4444' }, // Red-100/800
    gray: { bg: '#f1f5f9', text: '#1e293b', bar: '#64748b' }, // Slate-100/800
  };

  const theme = accessibleColors[color] || accessibleColors.gray;

  return (
    <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
      <h3 className='text-2xl font-bold mb-6 text-gray-800'>
        Safety Score Analysis
      </h3>

      <div className='flex items-center justify-center mb-8'>
        <div
          className='text-7xl font-black tracking-tight'
          style={{ color: theme.bar }}
        >
          {score.toFixed(1)}
        </div>
        <div className='text-3xl text-gray-300 font-medium ml-3'>/100</div>
      </div>

      {showLabel && (
        <div className='text-center mb-8'>
          <span
            className='inline-block px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-sm border'
            style={{
              backgroundColor: theme.bg,
              color: theme.text,
              borderColor: 'rgba(0,0,0,0.05)',
            }}
          >
            {rating}
          </span>
        </div>
      )}

      <div className='w-full bg-gray-100 rounded-full h-5 overflow-hidden shadow-inner p-1 mb-2'>
        <div
          className='h-full rounded-full transition-all duration-1000 ease-out shadow-sm'
          style={{
            width: `${score}%`,
            backgroundColor: theme.bar,
          }}
        />
      </div>

      <div className='mt-6 text-base text-gray-500 text-center font-medium'>
        Based on violent and property crime rates in this jurisdiction
      </div>
    </div>
  );
}
