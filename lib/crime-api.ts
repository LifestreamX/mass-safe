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
  population?: number,
): Promise<FBICrimeData> {
  const apiKey = process.env.FBI_API_KEY;

  // If no API key is configured in development, fall back to a deterministic
  // mock estimate based on population so the app remains usable locally.
  if (!apiKey) {
    const pop = population ?? 0;
    if (pop > 0) {
      // Simple per-100k estimates (approximate):
      // violent ~ 400 per 100k, property ~ 1500 per 100k
      const violentCrime = Math.round((pop / 100000) * 400);
      const propertyCrime = Math.round((pop / 100000) * 1500);
      return {
        violentCrime,
        propertyCrime,
        year: new Date().getFullYear() - 1,
        source: 'mock',
      } as FBICrimeData;
    }

    // Generic small-city fallback when population unknown
    return {
      violentCrime: 50,
      propertyCrime: 300,
      year: new Date().getFullYear() - 1,
      source: 'mock',
    } as FBICrimeData;
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
  let liveFetchFailed = false;
  let lastFetchError: any = null;
  for (const off of offenseCandidates) {
    try {
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
        // If FBI returns 503 or other error, mark that live fetch failed and break to use mock fallback
        liveFetchFailed = true;
        lastFetchError = { status: res.status, body: json };
        break;
      }

      let count = 0;
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
    } catch (err) {
      liveFetchFailed = true;
      lastFetchError = err;
      break;
    }
  }

  if (!liveFetchFailed && Object.keys(results).length > 0) {
    return {
      violentCrime: results.violentCrime,
      propertyCrime: results.propertyCrime,
      year,
      source: 'live',
    } as FBICrimeData;
  }

  // If live fetch failed for any reason, fall back to deterministic mock estimates
  console.warn(
    'FBI live fetch failed, falling back to mock data.',
    lastFetchError,
  );
  const pop = population ?? 0;
  if (pop > 0) {
    const violentCrime = Math.round((pop / 100000) * 400);
    const propertyCrime = Math.round((pop / 100000) * 1500);
    return {
      violentCrime,
      propertyCrime,
      year,
      source: 'mock',
    } as FBICrimeData;
  }

  return {
    violentCrime: 50,
    propertyCrime: 300,
    year,
    source: 'mock',
  } as FBICrimeData;
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
