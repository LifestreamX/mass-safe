'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

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
      // Prompt user to sign in
      signIn('google');
      return;
    }

    setLoading(true);

    try {
      if (saved) {
        // Remove saved location - assuming cityId is enough for deleteMany
        const response = await fetch(`/api/save-location?cityId=${cityId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSaved(false);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to remove location');
        }
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

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`px-8 py-3 rounded-full font-bold shadow-md transform transition active:scale-95 ${
        saved
          ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500 hover:bg-emerald-100'
          : 'bg-primary text-white hover:shadow-lg hover:brightness-105'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className='flex items-center gap-2'>
        {loading ? (
          <span className='animate-pulse'>Processing...</span>
        ) : saved ? (
          <>
            <span className='text-lg'>✓</span>
            <span>Saved</span>
          </>
        ) : (
          <>
            <span className='text-lg'>+</span>
            <span>Save to List</span>
          </>
        )}
      </div>
    </button>
  );
}
