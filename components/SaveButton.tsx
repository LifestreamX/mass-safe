'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface SaveButtonProps {
  cityId: string;
  cityName: string;
  safetyScore: number;
  initialSaved?: boolean;
}

export default function SaveButton({
  cityId,
  cityName,
  safetyScore,
  initialSaved = false,
}: SaveButtonProps) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!session) {
      alert('Please sign in to save locations');
      return;
    }

    setLoading(true);

    try {
      if (saved) {
        // Remove saved location
        // Note: This would require getting the savedLocation ID
        // For simplicity, we'll just toggle the state
        setSaved(false);
      } else {
        // Save location
        const response = await fetch('/api/save-location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cityId,
            safetyScore,
          }),
        });

        if (response.ok) {
          setSaved(true);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to save location');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save location');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`px-6 py-3 rounded-lg font-semibold transition ${
        saved
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-primary text-white hover:bg-blue-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Saving...' : saved ? '✓ Saved' : '+ Save this city'}
    </button>
  );
}
