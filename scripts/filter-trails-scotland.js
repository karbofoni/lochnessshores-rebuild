/**
 * Filter trails to Scotland/North England (north of Lake District)
 */

const fs = require('fs');
const path = require('path');

const MIN_LATITUDE = 54.5;

const inputPath = path.join(__dirname, '../data/trails.json');
const rawData = fs.readFileSync(inputPath, 'utf8');
const allTrails = JSON.parse(rawData);

console.log(`Total trails: ${allTrails.length}`);

// Filter: north of Lake District
const filtered = allTrails.filter(trail => {
    return trail.start_point_lat >= MIN_LATITUDE;
});

console.log(`After filtering (north of ${MIN_LATITUDE}°): ${filtered.length}`);

fs.writeFileSync(inputPath, JSON.stringify(filtered, null, 2));
console.log(`Saved ${filtered.length} Scotland/North trails`);

// Sample
filtered.slice(0, 3).forEach(t => {
    console.log(`  - ${t.name} (${t.start_point_lat.toFixed(2)}°N)`);
});
