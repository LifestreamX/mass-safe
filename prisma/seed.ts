import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csvParse from 'csv-parse/sync';

const prisma = new PrismaClient();

// Use the new authoritative CSV
const csvPath = path.join(__dirname, '../massachusetts_municipalities.csv');
const csvData = fs.readFileSync(csvPath, 'utf-8');
const massachusettsCities = csvParse.parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.crimeCache.deleteMany();
  await prisma.savedLocation.deleteMany();
  await prisma.city.deleteMany();

  // Seed cities from new CSV
  for (const row of massachusettsCities) {
    // Some rows may have missing or malformed data, skip if so
    if (!row.Name || !row.County) continue;
    // Parse population and area fields
    const population = parseInt(row.Population || '0', 10);
    // Area fields may be missing or malformed
    const latitude = null; // Not present in new CSV
    const longitude = null; // Not present in new CSV
    await prisma.city.create({
      data: {
        name: row.Name,
        county: row.County,
        population: isNaN(population) ? 0 : population,
        latitude,
        longitude,
        state: 'Massachusetts',
        type: row.Type || null,
        government: row.Government || null,
        area_total_sq_mi: row.Area_Total_sq_mi
          ? parseFloat(row.Area_Total_sq_mi)
          : null,
        area_land_sq_mi: row.Area_Land_sq_mi
          ? parseFloat(row.Area_Land_sq_mi)
          : null,
        year_incorporated: row.Year_Incorporated
          ? parseInt(row.Year_Incorporated, 10)
          : null,
      },
    });
    console.log(`Created city: ${row.Name}`);
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
