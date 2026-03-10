'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CrimeBreakdownProps {
  violentCrime: number;
  propertyCrime: number;
}

export function CrimeBreakdownChart({
  violentCrime,
  propertyCrime,
}: CrimeBreakdownProps) {
  const data = [
    { name: 'Violent Crime', count: violentCrime, fill: '#ef4444' },
    { name: 'Property Crime', count: propertyCrime, fill: '#f59e0b' },
  ];

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-xl font-semibold mb-4'>Crime Breakdown</h3>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='count' fill='#2563eb' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TrendData {
  year: number;
  violentCrime: number;
  propertyCrime: number;
}

interface CrimeTrendProps {
  data: TrendData[];
}

export function CrimeTrendChart({ data }: CrimeTrendProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-xl font-semibold mb-4'>Crime Trends</h3>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='year' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='violentCrime'
            stroke='#ef4444'
            strokeWidth={2}
            name='Violent Crime'
          />
          <Line
            type='monotone'
            dataKey='propertyCrime'
            stroke='#f59e0b'
            strokeWidth={2}
            name='Property Crime'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ComparisonProps {
  cityScore: number;
  cityName: string;
  stateAverage: number;
}

export function ComparisonChart({
  cityScore,
  cityName,
  stateAverage,
}: ComparisonProps) {
  const data = [
    { name: cityName, score: cityScore, fill: '#2563eb' },
    { name: 'MA Average', score: stateAverage, fill: '#64748b' },
  ];

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-xl font-semibold mb-4'>Massachusetts Comparison</h3>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey='score' fill='#2563eb' name='Safety Score' />
        </BarChart>
      </ResponsiveContainer>
      <div className='mt-4 text-sm text-gray-600 text-center'>
        {cityScore > stateAverage
          ? `${cityName} is ${(cityScore - stateAverage).toFixed(1)} points safer than the state average`
          : `${cityName} is ${(stateAverage - cityScore).toFixed(1)} points below the state average`}
      </div>
    </div>
  );
}

interface CrimePieProps {
  violentCrime: number;
  propertyCrime: number;
}

export function CrimePieChart({ violentCrime, propertyCrime }: CrimePieProps) {
  const data = [
    { name: 'Violent Crime', value: violentCrime },
    { name: 'Property Crime', value: propertyCrime },
  ];

  const COLORS = ['#ef4444', '#f59e0b'];

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-xl font-semibold mb-4'>Crime Distribution</h3>
      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
