/**
 * Add geocoded coordinates to existing cities in database
 * Uses Nominatim (OpenStreetMap) - free, no API key required
 * Rate limit: 1 request per second
 */

import { PrismaClient } from '@prisma/client';
import { geocodeCity, delay } from '../lib/geocode';

const prisma = new PrismaClient();

async function main() {
  console.log('🗺️  Starting geocoding process...\n');

  // Get all cities without coordinates
  const cities = await prisma.city.findMany({
    where: {
      OR: [{ latitude: null }, { longitude: null }],
    },
    select: {
      id: true,
      name: true,
      jurisdiction: true,
    },
  });

  console.log(`📍 Found ${cities.length} cities without coordinates\n`);

  if (cities.length === 0) {
    console.log('✅ All cities already have coordinates!');
    return;
  }

  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const progress = `[${i + 1}/${cities.length}]`;

    try {
      console.log(`${progress} Geocoding ${city.name}...`);

      const coords = await geocodeCity(city.name, 'Massachusetts');

      if (coords) {
        await prisma.city.update({
          where: { id: city.id },
          data: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });

        successCount++;
        console.log(
          `   ✅ ${city.name}: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
        );
      } else {
        failCount++;
        console.log(`   ⚠️  ${city.name}: No coordinates found`);
      }

      // Respect Nominatim rate limit: 1 request per second
      if (i < cities.length - 1) {
        await delay(1100);
      }
    } catch (error: any) {
      failCount++;
      console.error(`   ❌ ${city.name}: ${error.message}`);
    }

    // Log progress every 10 cities
    if ((i + 1) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      const remaining = ((cities.length - i - 1) * 1.1) / 60;
      console.log(
        `\n📊 Progress: ${successCount} success, ${failCount} failed | ${elapsed}min elapsed, ~${remaining.toFixed(1)}min remaining\n`,
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log('\n🎉 Geocoding complete!');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⏱️  Time: ${totalTime} minutes`);
  console.log(
    `   📊 Total cities with coords: ${await prisma.city.count({ where: { latitude: { not: null } } })}`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Geocoding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
