import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csvParse from 'csv-parse/sync';

const prisma = new PrismaClient();

const csvPath = path.join(__dirname, '../locations.csv');
const csvData = fs.readFileSync(csvPath, 'utf-8');
const records = csvParse.parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

// Filter for Massachusetts (USPS == 'MA')
const massachusettsCities = records.filter((row: any) => row.USPS === 'MA');

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.crimeCache.deleteMany();
  await prisma.savedLocation.deleteMany();
  await prisma.city.deleteMany();

  // Seed cities from CSV
  for (const row of massachusettsCities) {
    // Some rows may have missing or malformed data, skip if so
    if (!row.NAME || !row.INTPTLAT || !row.INTPTLONG) continue;
    const population = parseInt(row.POPESTIMATE || row.POPULATION || '0', 10);
    await prisma.city.create({
      data: {
        name: row.NAME,
        county: row.COUNTY || '',
        population: isNaN(population) ? 0 : population,
        latitude: parseFloat(row.INTPTLAT),
        longitude: parseFloat(row.INTPTLONG),
        state: 'Massachusetts',
      },
    });
    console.log(`Created city: ${row.NAME}`);
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
