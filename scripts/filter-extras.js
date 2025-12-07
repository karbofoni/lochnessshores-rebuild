/**
 * Filter extras to Scotland only (already fetched from Scotland area)
 * Just keep those with website or phone
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/extras.json');
const rawData = fs.readFileSync(inputPath, 'utf8');
const allExtras = JSON.parse(rawData);

console.log(`Total extras: ${allExtras.length}`);

// Filter: must have website OR phone
const filtered = allExtras.filter(extra => {
    return extra.website_url || extra.phone;
});

console.log(`After filtering (has website/phone): ${filtered.length}`);

fs.writeFileSync(inputPath, JSON.stringify(filtered, null, 2));
console.log(`Saved ${filtered.length} extras with contact info`);

// Sample
filtered.slice(0, 3).forEach(e => {
    console.log(`  - ${e.name} (${e.type}) - ${e.website_url || e.phone}`);
});
