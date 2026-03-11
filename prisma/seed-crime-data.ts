import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Read the JSON file
  const jsonPath = path.join(process.cwd(), 'ma_crime_overview_2024.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const crimeData = JSON.parse(rawData);

  console.log(`📊 Found ${crimeData.length} jurisdictions to seed`);

  // Clear existing data
  console.log('🗑️  Clearing existing city data...');
  await prisma.crimeCache.deleteMany({});
  await prisma.savedLocation.deleteMany({});
  await prisma.city.deleteMany({});

  console.log('✅ Existing data cleared');

  // Seed new data
  let successCount = 0;
  let skipCount = 0;

  for (const item of crimeData) {
    try {
      // Skip entries without valid data
      if (!item.success || !item.name) {
        skipCount++;
        continue;
      }

      await prisma.city.create({
        data: {
          jurisdiction: item.jurisdiction,
          name: item.name,
          url: item.url,
          year: item.year,
          crimesTotal: item.crimes.total || 0,
          crimesClearanceRate: item.crimes.clearanceRate,
          population: item.population || 0,
          crimeRate: item.crimeRate,
          arrestsTotal: item.arrests.total || 0,
          arrestRate: item.arrests.arrestRate,
          success: item.success,
          state: 'Massachusetts',
        },
      });

      successCount++;

      // Log progress every 50 items
      if (successCount % 50 === 0) {
        console.log(`   ✓ Seeded ${successCount} jurisdictions...`);
      }
    } catch (error: any) {
      console.error(`❌ Error seeding ${item.name}:`, error.message);
    }
  }

  console.log('\n📈 Seed Summary:');
  console.log(`   ✅ Successfully seeded: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   📊 Total in database: ${await prisma.city.count()}`);

  console.log('\n🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
