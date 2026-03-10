'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface City {
  id: string;
  name: string;
  county: string;
  population: number;
}

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
}

export default function SearchBar({
  initialValue = '',
  placeholder = 'Search Massachusetts cities or ZIP codes',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchCities = async () => {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/city-search?q=${encodeURIComponent(query)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setIsOpen(data.length > 0);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchCities, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      navigateToCity(results[0].name);
    }
  };

  const navigateToCity = (cityName: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/city/${encodeURIComponent(cityName.toLowerCase())}`);
  };

  return (
    <div className='relative w-full max-w-2xl' ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div className='relative'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className='w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary shadow-lg'
          />
          <button
            type='submit'
            className='absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary text-white rounded-full hover:bg-blue-700 transition'
          >
            Search
          </button>
        </div>
      </form>

      {isOpen && (
        <div className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto'>
          {loading ? (
            <div className='p-4 text-center text-gray-500'>Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((city) => (
                <li
                  key={city.id}
                  onClick={() => navigateToCity(city.name)}
                  className='p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0'
                >
                  <div className='font-semibold text-gray-900'>{city.name}</div>
                  <div className='text-sm text-gray-600'>
                    {city.county} County • Population:{' '}
                    {city.population.toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='p-4 text-center text-gray-500'>No cities found</div>
          )}
        </div>
      )}
    </div>
  );
}
