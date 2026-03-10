/**
 * FBI Crime Data Explorer API Integration
 * Free tier API for crime statistics
 */

export interface FBICrimeData {
  violentCrime: number;
  propertyCrime: number;
  year: number;
  source?: 'live' | 'mock';
}

const FBI_API_BASE = 'https://api.usa.gov/crime/fbi/cde';

/**
 * Fetch crime data for a specific city and state
 * Falls back to mock data for development
 */
export async function fetchCrimeData(
  cityName: string,
  state: string = 'Massachusetts',
): Promise<FBICrimeData> {
  const apiKey = process.env.FBI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'FBI_API_KEY not configured. Please set a valid api.data.gov key in your .env.',
    );
  }

  const overrideBase = process.env.FBI_API_ENDPOINT;
  const base = overrideBase || FBI_API_BASE;
  const year = new Date().getFullYear() - 1;

  // Use correct FBI endpoint: /summarized/state/{state}/{offense}/{year}
  const offenseCandidates = [
    { key: 'violentCrime', id: 'violent-crime' },
    { key: 'propertyCrime', id: 'property-crime' },
  ];

  const results: Record<string, number> = {};
  for (const off of offenseCandidates) {
    let count = 0;
    let lastError: any = null;
    const candidateUrl = `${base}/summarized/state/${encodeURIComponent(state)}/${off.id}/${year}?api_key=${apiKey}`;
    const res = await fetch(candidateUrl, {
      next: { revalidate: 86400 },
      headers: { 'x-api-key': apiKey },
    });
    const txt = await res.text();
    let json: any;
    try {
      json = JSON.parse(txt);
    } catch (e) {
      json = txt;
    }

    if (!res.ok) {
      // Custom handling for 503 Service Unavailable
      if (res.status === 503) {
        throw new Error(
          'The FBI Crime Data API is temporarily unavailable (503 Service Unavailable). Please try again later.',
        );
      }
      lastError = `FBI candidate URL failed: ${candidateUrl} ${res.status} ${JSON.stringify(json)}`;
      throw new Error(lastError);
    }

    if (Array.isArray(json.results) && json.results.length > 0) {
      const r = json.results[0];
      count =
        typeof r.actual === 'number'
          ? r.actual
          : Number(r.count || r.value || 0);
    } else if (Array.isArray(json.data) && json.data.length > 0) {
      const r = json.data[0];
      count = Number(r.actual || r.count || r.value || 0);
    } else if (typeof json === 'object' && json !== null) {
      count = Number(json.actual || json.count || json.value || 0);
    }

    results[off.key] = count || 0;
  }

  if (Object.keys(results).length > 0) {
    return {
      violentCrime: results.violentCrime,
      propertyCrime: results.propertyCrime,
      year,
      source: 'live',
    } as FBICrimeData;
  }

  throw new Error(
    'FBI API: no summarized endpoints returned valid data. No mock data fallback.',
  );
}

/**
 * Parse FBI API response
 * Adjust this based on actual API response structure
 */
function parseFBIResponse(data: any, cityName: string): FBICrimeData {
  // This is a placeholder implementation
  // Actual implementation depends on FBI API response structure
  return {
    violentCrime: data.violent_crime || 0,
    propertyCrime: data.property_crime || 0,
    year: data.year || new Date().getFullYear() - 1,
  };
}
