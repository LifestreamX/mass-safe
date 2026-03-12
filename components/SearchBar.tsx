'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface City {
  id: string;
  jurisdiction: string;
  name: string;
  population: number;
  crimeRate: number | null;
  crimesTotal: number;
}

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
}

export default function SearchBar({
  initialValue = '',
  placeholder = 'Search...',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
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
    const handleTouchStart = (event: TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchStart);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchStart);
    };
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
    if (highlightedIndex >= 0 && results[highlightedIndex]) {
      navigateToCity(results[highlightedIndex].jurisdiction);
    } else if (results.length > 0) {
      navigateToCity(results[0].jurisdiction);
    }
  };

  const navigateToCity = (jurisdiction: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/city/${encodeURIComponent(jurisdiction)}`);
  };

  return (
    <div
      className='relative w-full max-w-2xl flex justify-center z-0'
      ref={dropdownRef}
    >
      <form onSubmit={handleSubmit} className='w-full'>
        {/* Responsive: stack input and button on mobile, inline on sm+ */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:relative gap-2 sm:gap-0'>
          <input
            type='text'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(-1);
            }}
            placeholder={placeholder}
            className='w-full h-14 sm:h-auto px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary shadow-lg text-center transition-all duration-200 focus:shadow-primary/20'
            autoComplete='off'
            aria-autocomplete='list'
            aria-expanded={isOpen}
            aria-controls='city-search-dropdown'
            onKeyDown={(e) => {
              if (!isOpen) return;
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev < results.length - 1 ? prev + 1 : 0,
                );
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev > 0 ? prev - 1 : results.length - 1,
                );
              } else if (e.key === 'Enter') {
                if (highlightedIndex >= 0 && results[highlightedIndex]) {
                  e.preventDefault();
                  navigateToCity(results[highlightedIndex].name);
                }
              }
            }}
          />
          {/* Button below input on mobile, inline on sm+ */}
          <button
            type='submit'
            className='mt-2 sm:mt-0 w-full h-14 sm:w-auto sm:h-auto sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 px-6 py-4 bg-primary text-white rounded-full hover:filter hover:brightness-90 transition text-lg font-semibold'
          >
            Search
          </button>
        </div>
      </form>

      {isOpen && (
        <div
          id='city-search-dropdown'
          className='absolute left-0 right-0 mx-auto z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto animate-fade-in'
          style={{ minWidth: '300px', top: '100%', width: '100%' }}
        >
          <style jsx>{`
            #city-search-dropdown::-webkit-scrollbar {
              width: 10px;
              background: #f1f5f9;
            }
            #city-search-dropdown::-webkit-scrollbar-thumb {
              background: #0f766e;
              border-radius: 8px;
            }
            #city-search-dropdown {
              scrollbar-color: #0f766e #f1f5f9;
              scrollbar-width: thin;
            }
          `}</style>
          {loading ? (
            <div className='p-4 text-center text-gray-500'>Searching...</div>
          ) : results.length > 0 ? (
            <ul className='divide-y divide-gray-100'>
              {results.map((city, idx) => (
                <li
                  key={city.id}
                  onClick={() => navigateToCity(city.jurisdiction)}
                  className={`px-5 py-3 cursor-pointer transition-colors duration-150 outline-none ${
                    highlightedIndex === idx
                      ? 'bg-primary/20'
                      : 'hover:bg-primary/10'
                  }`}
                  tabIndex={0}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigateToCity(city.jurisdiction);
                  }}
                  aria-selected={highlightedIndex === idx}
                >
                  <div className='grid grid-cols-3 items-center text-left w-full gap-4'>
                    <div className='flex items-center justify-start gap-2'>
                      <span className='font-semibold text-gray-900'>
                        {city.name}
                      </span>
                    </div>

                    <div className='text-xs text-gray-500'>
                      {city.crimeRate !== null
                        ? `Crime Rate: ${city.crimeRate.toFixed(2)}`
                        : 'Crime Rate: N/A'}
                    </div>

                    <div className='text-xs text-gray-400'>
                      Pop. {city.population.toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='p-4 text-center text-gray-500'>
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
