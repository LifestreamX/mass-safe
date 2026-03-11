'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapPin {
  latitude: number;
  longitude: number;
  cityName: string;
}

interface MapViewProps {
  latitude?: number;
  longitude?: number;
  cityName?: string;
  pins?: MapPin[];
}

export default function MapView({
  latitude,
  longitude,
  cityName,
  pins = [],
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Dynamically import Leaflet on the client only
    import('leaflet').then((Lmodule) => {
      if (cancelled) return;
      const L = (Lmodule as any).default ?? Lmodule;

      try {
        // Fix default icon paths when loading from CDN
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
      } catch (e) {
        // ignore
      }

      // Ensure container is empty
      containerRef.current!.innerHTML = '';

      // If a previous map exists, remove it first
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapRef.current = null;
      }

      // Determine center and markers
      const activePins = [...pins];
      if (latitude != null && longitude != null && cityName) {
        activePins.push({ latitude, longitude, cityName });
      }

      if (activePins.length === 0) return;

      // Center map on first pin or provided coordinates
      const centerLat = latitude ?? activePins[0].latitude;
      const centerLng = longitude ?? activePins[0].longitude;

      // Create the Leaflet map directly
      const map = L.map(containerRef.current as HTMLElement, {
        zoomControl: true,
      }).setView([centerLat, centerLng], pins.length > 1 ? 8 : 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add all markers
      const markerGroup = L.featureGroup();
      activePins.forEach((pin) => {
        const marker = L.marker([pin.latitude, pin.longitude])
          .bindPopup(`<strong>${pin.cityName}</strong><br/>Massachusetts`)
          .addTo(map);
        markerGroup.addLayer(marker);
      });

      // If multiple pins, fit bounds to show all
      if (activePins.length > 1) {
        map.fitBounds(markerGroup.getBounds().pad(0.1));
      } else if (activePins.length === 1) {
        L.marker([activePins[0].latitude, activePins[0].longitude])
          .addTo(map)
          .bindPopup(
            `<strong>${activePins[0].cityName}</strong><br/>Massachusetts`,
          )
          .openPopup();
      }

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, cityName, pins]);

  return (
    <div className='w-full h-96 rounded-lg overflow-hidden relative'>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
