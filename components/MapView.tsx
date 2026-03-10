'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

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
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Import Leaflet directly for markers and icons which need DOM
    import('leaflet').then((leaflet) => {
      setL(leaflet);
      // Fix Leaflet's default marker icon issue in Next.js
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    });
  }, []);

  if (!L) {
    return (
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='p-4 border-b'>
          <h3 className='text-xl font-semibold'>Location</h3>
        </div>
        <div className='h-96 w-full flex items-center justify-center bg-gray-100'>
          <div className='text-gray-500'>Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden relative z-0'>
      <div className='p-4 border-b'>
        <h3 className='text-xl font-semibold'>Location: {cityName}</h3>
      </div>
      <div className='h-96 w-full'>
        <MapContainer
          center={[latitude, longitude]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Marker position={[latitude, longitude]}>
            <Popup>
              <strong>{cityName}</strong>
              <br />
              Massachusetts
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
