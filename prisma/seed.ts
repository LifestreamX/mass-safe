import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const massachusettsCities = [
  // Major cities
  {
    name: 'Boston',
    county: 'Suffolk',
    population: 675647,
    latitude: 42.3601,
    longitude: -71.0589,
  },
  {
    name: 'Worcester',
    county: 'Worcester',
    population: 185877,
    latitude: 42.2626,
    longitude: -71.8023,
  },
  {
    name: 'Springfield',
    county: 'Hampden',
    population: 153606,
    latitude: 42.1015,
    longitude: -72.5898,
  },
  {
    name: 'Cambridge',
    county: 'Middlesex',
    population: 118403,
    latitude: 42.3736,
    longitude: -71.1097,
  },
  {
    name: 'Lowell',
    county: 'Middlesex',
    population: 110699,
    latitude: 42.6334,
    longitude: -71.3162,
  },
  {
    name: 'Brockton',
    county: 'Plymouth',
    population: 95708,
    latitude: 42.0834,
    longitude: -71.0184,
  },
  {
    name: 'Quincy',
    county: 'Norfolk',
    population: 94470,
    latitude: 42.2529,
    longitude: -71.0023,
  },
  {
    name: 'Lynn',
    county: 'Essex',
    population: 94201,
    latitude: 42.4668,
    longitude: -70.9495,
  },
  {
    name: 'New Bedford',
    county: 'Bristol',
    population: 95072,
    latitude: 41.6362,
    longitude: -70.9342,
  },
  {
    name: 'Fall River',
    county: 'Bristol',
    population: 89618,
    latitude: 41.7015,
    longitude: -71.155,
  },

  // Mid-size cities
  {
    name: 'Newton',
    county: 'Middlesex',
    population: 88414,
    latitude: 42.337,
    longitude: -71.2092,
  },
  {
    name: 'Somerville',
    county: 'Middlesex',
    population: 81045,
    latitude: 42.3876,
    longitude: -71.0995,
  },
  {
    name: 'Lawrence',
    county: 'Essex',
    population: 80028,
    latitude: 42.707,
    longitude: -71.1631,
  },
  {
    name: 'Framingham',
    county: 'Middlesex',
    population: 72362,
    latitude: 42.2793,
    longitude: -71.4162,
  },
  {
    name: 'Waltham',
    county: 'Middlesex',
    population: 62597,
    latitude: 42.3765,
    longitude: -71.2356,
  },
  {
    name: 'Malden',
    county: 'Middlesex',
    population: 61009,
    latitude: 42.4251,
    longitude: -71.0662,
  },
  {
    name: 'Brookline',
    county: 'Norfolk',
    population: 59180,
    latitude: 42.3318,
    longitude: -71.1212,
  },
  {
    name: 'Plymouth',
    county: 'Plymouth',
    population: 58715,
    latitude: 41.9584,
    longitude: -70.6673,
  },
  {
    name: 'Medford',
    county: 'Middlesex',
    population: 57341,
    latitude: 42.4184,
    longitude: -71.1062,
  },
  {
    name: 'Taunton',
    county: 'Bristol',
    population: 57027,
    latitude: 41.9001,
    longitude: -71.0898,
  },

  // Smaller cities and towns
  {
    name: 'Chicopee',
    county: 'Hampden',
    population: 55298,
    latitude: 42.1487,
    longitude: -72.6079,
  },
  {
    name: 'Weymouth',
    county: 'Norfolk',
    population: 55419,
    latitude: 42.2181,
    longitude: -70.94,
  },
  {
    name: 'Revere',
    county: 'Suffolk',
    population: 53073,
    latitude: 42.4084,
    longitude: -71.012,
  },
  {
    name: 'Peabody',
    county: 'Essex',
    population: 52376,
    latitude: 42.5279,
    longitude: -70.9286,
  },
  {
    name: 'Methuen',
    county: 'Essex',
    population: 47255,
    latitude: 42.7262,
    longitude: -71.1909,
  },
  {
    name: 'Barnstable',
    county: 'Barnstable',
    population: 44641,
    latitude: 41.7003,
    longitude: -70.3002,
  },
  {
    name: 'Salem',
    county: 'Essex',
    population: 43353,
    latitude: 42.5195,
    longitude: -70.8967,
  },
  {
    name: 'Pittsfield',
    county: 'Berkshire',
    population: 42514,
    latitude: 42.4501,
    longitude: -73.2453,
  },
  {
    name: 'Attleboro',
    county: 'Bristol',
    population: 43886,
    latitude: 41.9445,
    longitude: -71.2856,
  },
  {
    name: 'Everett',
    county: 'Middlesex',
    population: 46451,
    latitude: 42.4084,
    longitude: -71.0537,
  },

  // Additional towns
  {
    name: 'Arlington',
    county: 'Middlesex',
    population: 45379,
    latitude: 42.4154,
    longitude: -71.1565,
  },
  {
    name: 'Beverly',
    county: 'Essex',
    population: 41825,
    latitude: 42.5584,
    longitude: -70.88,
  },
  {
    name: 'Woburn',
    county: 'Middlesex',
    population: 40228,
    latitude: 42.4792,
    longitude: -71.1523,
  },
  {
    name: 'Chelsea',
    county: 'Suffolk',
    population: 39878,
    latitude: 42.3918,
    longitude: -71.0328,
  },
  {
    name: 'Leominster',
    county: 'Worcester',
    population: 41303,
    latitude: 42.5251,
    longitude: -71.7598,
  },
  {
    name: 'Haverhill',
    county: 'Essex',
    population: 62088,
    latitude: 42.7762,
    longitude: -71.0773,
  },
  {
    name: 'Fitchburg',
    county: 'Worcester',
    population: 40318,
    latitude: 42.5834,
    longitude: -71.8023,
  },
  {
    name: 'Westfield',
    county: 'Hampden',
    population: 41094,
    latitude: 42.1251,
    longitude: -72.7495,
  },
  {
    name: 'Holyoke',
    county: 'Hampden',
    population: 40341,
    latitude: 42.2043,
    longitude: -72.6162,
  },
  {
    name: 'Gloucester',
    county: 'Essex',
    population: 30291,
    latitude: 42.6159,
    longitude: -70.6631,
  },

  // More towns
  {
    name: 'Marlborough',
    county: 'Middlesex',
    population: 39414,
    latitude: 42.3459,
    longitude: -71.5523,
  },
  {
    name: 'Watertown',
    county: 'Middlesex',
    population: 35329,
    latitude: 42.3709,
    longitude: -71.1828,
  },
  {
    name: 'Lexington',
    county: 'Middlesex',
    population: 33304,
    latitude: 42.4473,
    longitude: -71.2245,
  },
  {
    name: 'Needham',
    county: 'Norfolk',
    population: 31388,
    latitude: 42.2834,
    longitude: -71.2329,
  },
  {
    name: 'Wellesley',
    county: 'Norfolk',
    population: 29550,
    latitude: 42.2968,
    longitude: -71.2928,
  },
  {
    name: 'Natick',
    county: 'Middlesex',
    population: 35874,
    latitude: 42.2834,
    longitude: -71.3495,
  },
  {
    name: 'Dedham',
    county: 'Norfolk',
    population: 25330,
    latitude: 42.2418,
    longitude: -71.1662,
  },
  {
    name: 'Belmont',
    county: 'Middlesex',
    population: 26562,
    latitude: 42.3959,
    longitude: -71.1787,
  },
  {
    name: 'Stoneham',
    county: 'Middlesex',
    population: 22219,
    latitude: 42.4801,
    longitude: -71.0995,
  },
  {
    name: 'Milton',
    county: 'Norfolk',
    population: 27590,
    latitude: 42.2496,
    longitude: -71.0662,
  },
];

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.crimeCache.deleteMany();
  await prisma.savedLocation.deleteMany();
  await prisma.city.deleteMany();

  // Seed cities
  for (const city of massachusettsCities) {
    await prisma.city.create({
      data: {
        ...city,
        state: 'Massachusetts',
      },
    });
    console.log(`Created city: ${city.name}`);
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
