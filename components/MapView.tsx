'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  latitude: number;
  longitude: number;
  cityName: string;
}

export default function MapView({
  latitude,
  longitude,
  cityName,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      console.error('Mapbox token not configured');
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker
    new mapboxgl.Marker({ color: '#2563eb' })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${cityName}</strong><br>Massachusetts`,
        ),
      )
      .addTo(map.current);

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, cityName]);

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='p-4 border-b'>
        <h3 className='text-xl font-semibold'>Location</h3>
      </div>
      <div ref={mapContainer} className='h-96 w-full' />
      {!mapLoaded && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
          <div className='text-gray-500'>Loading map...</div>
        </div>
      )}
    </div>
  );
}
