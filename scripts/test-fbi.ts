import 'dotenv/config';
import { fetchCrimeData } from '../lib/crime-api';

async function run() {
  try {
    console.log(
      'Using FBI_API_KEY:',
      process.env.FBI_API_KEY ? 'present' : 'missing',
    );
    const city = process.argv[2] || 'Boston';
    console.log(
      `Fetching crime data for ${city} (only real FBI data, no mock fallback)...`,
    );
    const data = await fetchCrimeData(city);
    console.log('Fetch result:', JSON.stringify(data, null, 2));
  } catch (err: any) {
    console.error('Error during FBI API test:', err?.message || err);
    process.exit(1);
  }
}

run();
