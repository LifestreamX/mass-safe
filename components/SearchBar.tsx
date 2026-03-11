'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface City {
  id: string;
  name: string;
  county: string;
  population: number; // 2020 Census
  type?: string;
}

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
}

export default function SearchBar({
  initialValue = '',
  placeholder = 'Search Massachusetts cities',
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
      navigateToCity(results[highlightedIndex].name);
    } else if (results.length > 0) {
      navigateToCity(results[0].name);
    }
  };

  const navigateToCity = (cityName: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/city/${encodeURIComponent(cityName.toLowerCase())}`);
  };

  return (
    <div
      className='relative w-full max-w-2xl flex justify-center'
      ref={dropdownRef}
    >
      <form onSubmit={handleSubmit} className='w-full'>
        <div className='relative flex justify-center items-center'>
          <input
            type='text'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(-1);
            }}
            placeholder={placeholder}
            className='w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary shadow-lg text-center transition-all duration-200 focus:shadow-primary/20'
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
          <button
            type='submit'
            className='absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary text-white rounded-full hover:filter hover:brightness-90 transition'
          >
            Search
          </button>
        </div>
      </form>

      {isOpen && (
        <div
          id='city-search-dropdown'
          className='absolute left-0 right-0 mx-auto z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto animate-fade-in'
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
                  onClick={() => navigateToCity(city.name)}
                  className={`flex flex-col gap-1 px-5 py-3 cursor-pointer transition-colors duration-150 outline-none ${
                    highlightedIndex === idx
                      ? 'bg-primary/20'
                      : 'hover:bg-primary/10'
                  }`}
                  tabIndex={0}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigateToCity(city.name);
                  }}
                  aria-selected={highlightedIndex === idx}
                >
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-2'>
                      <span className='font-semibold text-gray-900'>
                        {city.name}
                      </span>
                      {city.type && (
                        <span className='ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'>
                          {city.type}
                        </span>
                      )}
                    </div>
                    <span className='text-xs text-gray-400'>
                      Pop. {city.population.toLocaleString()} (2020)
                    </span>
                  </div>
                  <span className='text-xs text-gray-500'>
                    {city.county} County
                  </span>
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
