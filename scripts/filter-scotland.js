/**
 * Filter campsites to Scotland/North England (north of Lake District)
 * Only include those with actual websites (not Google search fallback)
 */

const fs = require('fs');
const path = require('path');

// Lake District is roughly at latitude 54.4
// Filtering to north of this gives us Scotland + Northumberland
const MIN_LATITUDE = 54.5;

const osmPath = path.join(__dirname, '../data/campsites_osm.json');
const rawData = fs.readFileSync(osmPath, 'utf8');
const allCampsites = JSON.parse(rawData);

console.log(`Total campsites from OSM: ${allCampsites.length}`);

// Filter: north of Lake District AND has real website
const filtered = allCampsites.filter(site => {
    // Must be north of Lake District
    if (site.latitude < MIN_LATITUDE) return false;

    // Must have a real website (not Google search fallback)
    if (!site.external_booking_url) return false;
    if (site.external_booking_url.includes('google.com/search')) return false;

    return true;
});

console.log(`After filtering (north of ${MIN_LATITUDE}° + has website): ${filtered.length}`);

// Stats
const byArea = {};
filtered.forEach(site => {
    byArea[site.area_id] = (byArea[site.area_id] || 0) + 1;
});
console.log('By area:', byArea);

const withPhone = filtered.filter(s => s.phone).length;
const withEmail = filtered.filter(s => s.email).length;
console.log(`With phone: ${withPhone}`);
console.log(`With email: ${withEmail}`);

// Save to main campsites.json
const outputPath = path.join(__dirname, '../data/campsites.json');
fs.writeFileSync(outputPath, JSON.stringify(filtered, null, 2));
console.log(`\nSaved ${filtered.length} Scotland/North campsites to campsites.json`);

// Show sample
console.log('\nSample campsites:');
filtered.slice(0, 5).forEach(s => {
    console.log(`  - ${s.display_name} (${s.latitude.toFixed(2)}°N) - ${s.external_booking_url?.substring(0, 50)}...`);
});
