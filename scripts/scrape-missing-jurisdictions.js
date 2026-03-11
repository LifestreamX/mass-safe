const puppeteer = require('puppeteer');
const fs = require('fs');

/**
 * SCRAPE MISSING JURISDICTIONS
 * This script checks which jurisdictions are missing from the JSON file and scrapes only those
 */

// Full list of all jurisdictions from the original script
const allJurisdictions = [
  'massachusetts',
  'abington',
  'acton',
  'acushnet',
  'adams',
  'agawam',
  'amesbury',
  'amherst',
  'amherst-college',
  'andover',
  'aquinnah',
  'arlington',
  'ashburnham',
  'ashby',
  'ashfield',
  'ashland',
  'assumption-college',
  'athol',
  'attleboro',
  'auburn',
  'avon',
  'ayer',
  'babson-college',
  'barnstable',
  'barnstable-state-police',
  'barnstable-state-police-middleboro',
  'barre',
  'becker-college',
  'becket',
  'bedford',
  'belchertown',
  'bellingham',
  'belmont',
  'bentley-college',
  'berklee-college-of-music',
  'berkley',
  'berkshire-state-police',
  'berkshire-state-police-northampton',
  'berkshire-state-police-weston',
  'berlin',
  'bernardston',
  'beth-israel-deaconess-med-ctr',
  'beverly',
  'billerica',
  'blackstone',
  'bolton',
  'boston',
  'boston-and-maine-railroad-police-dept',
  'boston-college',
  'boston-university',
  'bourne',
  'boxborough',
  'boxford',
  'boylston',
  'braintree',
  'brandeis-university',
  'brewster',
  'bridgewater',
  'bridgewater-state-university',
  'brimfield',
  'bristol-comm-college',
  'bristol-state-police',
  'bristol-state-police-framingham',
  'bristol-state-police-middleboro',
  'brockton',
  'brookfield',
  'brookline',
  'buckland',
  'bunker-hill-community-college',
  'burlington',
  'cambridge',
  'canton',
  'cape-cod-community-college',
  'capitol-pd-boston',
  'carlisle',
  'carver',
  'charlemont',
  'charlton',
  'chatham',
  'chelmsford',
  'chelsea',
  'cheshire',
  'chester',
  'chesterfield',
  'chicopee',
  'chilmark',
  'clark-university',
  'clarksburg',
  'clinton',
  'cohasset',
  'col-of-the-holy-cross',
  'colrain',
  'concord',
  'cummington',
  'curry-college',
  'dalton',
  'danvers',
  'dartmouth',
  'dean-college',
  'dedham',
  'deerfield',
  'dennis',
  'dighton',
  'douglas',
  'dover',
  'dracut',
  'dudley',
  'dukes-state-police',
  'dukes-state-police-middleboro',
  'dunstable',
  'duxbury',
  'east-bridgewater',
  'east-brookfield',
  'east-longmeadow',
  'eastham',
  'easthampton',
  'easton',
  'edgartown',
  'egremont',
  'emerson-college',
  'endicott-college',
  'environmental-police',
  'erving',
  'essex',
  'essex-state-police',
  'essex-state-police-framingham',
  'everett',
  'fairhaven',
  'fall-river',
  'falmouth',
  'fisher-college',
  'fitchburg',
  'fitchburg-sc',
  'fitchburg-state-college',
  'foxborough',
  'framingham',
  'framingham-sc',
  'framingham-state-university',
  'franklin',
  'franklin-state-police',
  'franklin-state-police-holden',
  'franklin-state-police-northampton',
  'freetown',
  'gardner',
  'georgetown',
  'gill',
  'gloucester',
  'gordon-college',
  'goshen',
  'grafton',
  'granby',
  'granville',
  'great-barrington',
  'greenfield',
  'greenfield-cc',
  'groton',
  'groveland',
  'hadley',
  'halifax',
  'hamilton',
  'hampden',
  'hampden-state-police',
  'hampden-state-police-northampton',
  'hampden-state-police-weston',
  'hampshire-college',
  'hampshire-state-police',
  'hampshire-state-police-northampton',
  'hancock',
  'hanover',
  'hanson',
  'hardwick',
  'harvard',
  'harvard-university',
  'harwich',
  'hatfield',
  'haverhill',
  'hingham',
  'hinsdale',
  'holbrook',
  'holden',
  'holland',
  'holliston',
  'holyoke',
  'holyoke-community-college',
  'hopedale',
  'hopkinton',
  'hubbardston',
  'hudson',
  'hull',
  'ipswich',
  'kingston',
  'lakeville',
  'lancaster',
  'lanesboro',
  'lasell-college',
  'lawrence',
  'lee',
  'leicester',
  'lenox',
  'leominster',
  'leverett',
  'lexington',
  'leyden',
  'lincoln',
  'littleton',
  'longmeadow',
  'lowell',
  'ludlow',
  'lunenburg',
  'lynn',
  'lynnfield',
  'ma-college-of-liberal-arts',
  'malden',
  'manchester-by-the-sea',
  'mansfield',
  'marblehead',
  'marion',
  'marlborough',
  'marshfield',
  'mashpee',
  'mass-bay-community-college',
  'mass-college-of-art',
  'mass-general-hospital',
  'massasoit-community-college',
  'mattapoisett',
  'maynard',
  'mbta',
  'mbta-barnstable-county',
  'mbta-berkshire-county',
  'mbta-bristol-county',
  'mbta-dukes-county',
  'mbta-essex-county',
  'mbta-franklin-county',
  'mbta-hampden-county',
  'mbta-hampshire-county',
  'mbta-middlesex-county',
  'mbta-nantucket-county',
  'mbta-norfolk-county',
  'mbta-plymouth-county',
  'mbta-suffolk-county',
  'mbta-worcester-county',
  'mcphs-university',
  'medfield',
  'medford',
  'medway',
  'melrose',
  'mendon',
  'merrimac',
  'merrimack-college',
  'methuen',
  'middleborough',
  'middlesex-state-police',
  'middlesex-state-police-framingham',
  'middlesex-state-police-holden',
  'middlesex-state-police-weston',
  'middleton',
  'milford',
  'millbury',
  'millis',
  'millville',
  'milton',
  'mit',
  'monson',
  'montague',
  'monterey',
  'montgomery',
  'mount-ida-college',
  'mount-wachusett-cc',
  'mscpa-police',
  'mt-holyoke-college',
  'mt-ida-college',
  'nahant',
  'nantucket',
  'nantucket-state-police',
  'natick',
  'needham',
  'new-bedford',
  'new-braintree',
  'new-marlboro',
  'new-salem',
  'newbury',
  'newburyport',
  'newton',
  'norfolk',
  'norfolk-state-police',
  'norfolk-state-police-framingham',
  'norfolk-state-police-middleboro',
  'north-adams',
  'north-andover',
  'north-attleborough',
  'north-brookfield',
  'north-reading',
  'north-shore-cc',
  'north-shore-community-college',
  'northampton',
  'northborough',
  'northbridge',
  'northeastern-u',
  'northeastern-university',
  'northern-essex-community-college',
  'northfield',
  'norton',
  'norwell',
  'norwood',
  'oak-bluffs',
  'oakham',
  'orange',
  'orleans',
  'otis',
  'oxford',
  'palmer',
  'paxton',
  'peabody',
  'pelham',
  'pembroke',
  'pepperell',
  'petersham',
  'phillipston',
  'pittsfield',
  'plainfield',
  'plainville',
  'plymouth',
  'plymouth-state-police',
  'plymouth-state-police-middleboro',
  'plympton',
  'princeton',
  'provincetown',
  'quincy',
  'quinsigamond-cc',
  'randolph',
  'raynham',
  'reading',
  'regis-college',
  'rehoboth',
  'revere',
  'richmond',
  'rochester',
  'rockland',
  'rockport',
  'rowe',
  'rowley',
  'roxbury-community-college',
  'royalston',
  'russell',
  'rutland',
  'salem',
  'salem-state-college',
  'salem-state-university',
  'salisbury',
  'sandwich',
  'saugus',
  'savoy',
  'scituate',
  'seekonk',
  'sharon',
  'sheffield',
  'shelburne',
  'sherborn',
  'shirley',
  'shrewsbury',
  'shutesbury',
  'simmons-university',
  'smith-college',
  'somerset',
  'somerville',
  'south-hadley',
  'southampton',
  'southborough',
  'southbridge',
  'southwick',
  'spencer',
  'springfield',
  'springfield-college',
  'springfield-technical-community-college',
  'sterling',
  'stockbridge',
  'stoneham',
  'stonehill-college',
  'stoughton',
  'stow',
  'sturbridge',
  'sudbury',
  'suffolk-state-police',
  'suffolk-state-police-framingham',
  'suffolk-state-police-logan-airport',
  'suffolk-state-police-weston',
  'suffolk-university',
  'sunderland',
  'sutton',
  'swampscott',
  'swansea',
  'taunton',
  'templeton',
  'tewksbury',
  'tisbury',
  'tolland',
  'topsfield',
  'townsend',
  'truro',
  'tufts-university-medford',
  'tufts-university-prior-01012015',
  'tufts-university-since-01012015',
  'tufts-university-suffolk',
  'tufts-university-suffolk-prior-to-01012017',
  'tufts-university-worcester',
  'tyngsborough',
  'tyringham',
  'u-mass-amherst',
  'u-mass-boston',
  'u-mass-dartmouth',
  'u-mass-lowell',
  'u-mass-worcester',
  'u-mass-worcester-ma014um00',
  'uncategorized',
  'upton',
  'uxbridge',
  'wakefield',
  'wales',
  'walpole',
  'waltham',
  'ware',
  'wareham',
  'warren',
  'warwick',
  'watertown',
  'wayland',
  'webster',
  'wellesley',
  'wellesley-college',
  'wellfleet',
  'wendell',
  'wenham',
  'wentworth-institute',
  'wentworth-institute-of-technology',
  'west-boylston',
  'west-bridgewater',
  'west-brookfield',
  'west-newbury',
  'west-springfield',
  'west-stockbridge',
  'west-tisbury',
  'westborough',
  'western-new-england-coll',
  'western-new-england-university',
  'westfield',
  'westfield-state-college',
  'westford',
  'westhampton',
  'westminster',
  'weston',
  'westport',
  'westwood',
  'weymouth',
  'whately',
  'wheaton-college',
  'whitman',
  'wilbraham',
  'williamsburg',
  'williamstown',
  'wilmington',
  'winchendon',
  'winchester',
  'winthrop',
  'woburn',
  'worcester',
  'worcester-polytechnic-in',
  'worcester-state',
  'worcester-state-police',
  'worcester-state-police-holden',
  'worcester-state-police-weston',
  'worcester-state-university',
  'worthington',
  'wrentham',
  'yarmouth',
];

async function scrapeJurisdiction(browser, jurisdiction, index, total) {
  const url = `https://ma.beyond2020.com/ma_tops/report/crime-overview/${jurisdiction}/2024`;
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  );

  try {
    console.log(`[${index + 1}/${total}] Scraping ${jurisdiction}...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });

    const data = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const normalized = bodyText.replace(/\s+/g, ' ');

      const nameMatch = normalized.match(
        /Crime Overview\s+2024\s+([^]+?)(?=The graphs|Number of Crimes|CRIME OVERVIEW)/i,
      );
      const name = nameMatch ? nameMatch[1].trim() : 'Unknown';

      const crimeMatch = normalized.match(/Number of Crimes:\s*([\d,]+)/i);
      const clearanceMatch = normalized.match(/Clearance Rate:\s*([\d.]+)%/i);
      const populationMatch = normalized.match(/Population:\s*([\d,]+)/i);
      const crimeRateMatch = normalized.match(
        /Crime Rate:\s*([\d,.]+)\s*per\s*100,000/i,
      );

      const arrestMatch = normalized.match(/Number of Arrests:\s*([\d,]+)/i);
      const arrestRateMatch = normalized.match(
        /Arrest Rate:\s*([\d,.]+)\s*per\s*100,000/i,
      );

      const parseNum = (str) =>
        str ? parseFloat(str.replace(/,/g, '')) : null;

      return {
        name: name,
        year: '2024',
        crimes: {
          total: parseNum(crimeMatch ? crimeMatch[1] : null),
          clearanceRate: clearanceMatch ? parseFloat(clearanceMatch[1]) : null,
        },
        population: parseNum(populationMatch ? populationMatch[1] : null),
        crimeRate: parseNum(crimeRateMatch ? crimeRateMatch[1] : null),
        arrests: {
          total: parseNum(arrestMatch ? arrestMatch[1] : null),
          arrestRate: parseNum(arrestRateMatch ? arrestRateMatch[1] : null),
        },
      };
    });

    await page.close();
    return { jurisdiction, url, ...data, success: true };
  } catch (err) {
    console.error(`Failed ${jurisdiction}: ${err.message}`);
    await page.close();
    return { jurisdiction, url, error: err.message, success: false };
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== CHECKING FOR MISSING JURISDICTIONS ===');
  console.log(`Total jurisdictions in master list: ${allJurisdictions.length}`);

  // Read existing JSON file
  let existingData = [];
  try {
    const jsonContent = fs.readFileSync(
      '../ma_crime_overview_2024.json',
      'utf8',
    );
    existingData = JSON.parse(jsonContent);
    console.log(`Found ${existingData.length} already scraped`);
  } catch (err) {
    console.log('No existing file found, starting fresh');
  }

  // Find missing jurisdictions
  const scrapedJurisdictions = new Set(
    existingData.map((item) => item.jurisdiction),
  );
  const missingJurisdictions = allJurisdictions.filter(
    (j) => !scrapedJurisdictions.has(j),
  );

  console.log(`Missing jurisdictions: ${missingJurisdictions.length}`);
  console.log('Missing:', missingJurisdictions.join(', '));

  if (missingJurisdictions.length === 0) {
    console.log('\n✅ All jurisdictions already scraped!');
    return;
  }

  console.log('\n=== STARTING SCRAPE FOR MISSING JURISDICTIONS ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  const newResults = [];

  for (let i = 0; i < missingJurisdictions.length; i++) {
    const jurisdiction = missingJurisdictions[i];
    const result = await scrapeJurisdiction(
      browser,
      jurisdiction,
      i,
      missingJurisdictions.length,
    );
    newResults.push(result);

    // Merge and save after each scrape
    const mergedData = [...existingData, ...newResults];
    fs.writeFileSync(
      '../ma_crime_overview_2024.json',
      JSON.stringify(mergedData, null, 2),
    );

    console.log(
      `Saved! Total records: ${mergedData.length}/${allJurisdictions.length}`,
    );

    // Delay between requests
    if (i < missingJurisdictions.length - 1) {
      await sleep(3000);
    }
  }

  await browser.close();

  // Final summary
  const finalData = [...existingData, ...newResults];
  const successful = newResults.filter((r) => r.success && r.crimes.total > 0);
  const failed = newResults.filter((r) => !r.success);

  console.log('\n=== SCRAPE COMPLETE ===');
  console.log(`Previously scraped: ${existingData.length}`);
  console.log(`Newly scraped: ${newResults.length}`);
  console.log(`Total now: ${finalData.length}/${allJurisdictions.length}`);
  console.log(`Successful with data: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
}

main().catch(console.error);
