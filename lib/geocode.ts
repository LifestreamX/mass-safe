/**
 * Geocoding utility using Nominatim (OpenStreetMap)
 * Free, no API key required
 */

interface GeocodeResult {
  latitude: number;
  longitude: number;
}

/**
 * Geocode a city in Massachusetts using Nominatim
 */
export async function geocodeCity(
  cityName: string,
  state: string = 'Massachusetts',
): Promise<GeocodeResult | null> {
  try {
    const query = `${cityName}, ${state}, USA`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MassSafe/1.0 (Crime Safety App)',
      },
    });

    if (!response.ok) {
      console.error(`Geocoding failed for ${cityName}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.length === 0) {
      console.warn(`No geocoding results for ${cityName}`);
      return null;
    }

    const result = data[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
  } catch (error) {
    console.error(`Error geocoding ${cityName}:`, error);
    return null;
  }
}

/**
 * Add delay to respect Nominatim rate limits (1 request per second)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
