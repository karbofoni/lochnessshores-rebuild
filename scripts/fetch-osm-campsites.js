/**
 * OpenStreetMap Campsite Data Extractor
 * Fetches UK campsites from Overpass API and filters to those with phone/website
 */

const fs = require('fs');
const path = require('path');

// Overpass API endpoint
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Query for UK campsites with useful data
const OVERPASS_QUERY = `
[out:json][timeout:300];
area["ISO3166-1"="GB"]->.uk;
(
  node["tourism"="camp_site"](area.uk);
  way["tourism"="camp_site"](area.uk);
  relation["tourism"="camp_site"](area.uk);
);
out center tags;
`;

async function fetchCampsites() {
    console.log('Fetching UK campsites from OpenStreetMap...');

    const response = await fetch(OVERPASS_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(OVERPASS_QUERY)}`
    });

    if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.elements.length} raw campsites`);
    return data.elements;
}

function transformToSchema(osmElement, index) {
    const tags = osmElement.tags || {};
    const lat = osmElement.lat || osmElement.center?.lat;
    const lon = osmElement.lon || osmElement.center?.lon;

    // Generate slug from name
    const name = tags.name || `Campsite ${osmElement.id}`;
    const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);

    // Map OSM amenity tags to our facility tags
    const facilityTags = [];
    if (tags.shower === 'yes' || tags['amenity:shower'] === 'yes') facilityTags.push('shower');
    if (tags.toilets === 'yes' || tags['amenity:toilets'] === 'yes') facilityTags.push('toilets');
    if (tags.dogs === 'yes' || tags.dog === 'yes') facilityTags.push('dog');
    if (tags.electricity === 'yes' || tags.power_supply === 'yes') facilityTags.push('electric_hookup');
    if (tags.wifi === 'yes' || tags.internet_access === 'yes') facilityTags.push('wifi');
    if (tags.shop === 'yes') facilityTags.push('shop');
    if (tags.laundry === 'yes') facilityTags.push('laundry');
    if (tags.playground === 'yes') facilityTags.push('playground');
    if (tags.bbq === 'yes' || tags.firepit === 'yes') facilityTags.push('fire_allowed');

    // Determine stay types from tags
    const stayTypes = [];
    if (tags.tents === 'yes' || tags.tent === 'yes') stayTypes.push('lochside-campsite');
    if (tags.caravans === 'yes' || tags.caravan === 'yes') stayTypes.push('campervan-pitch');
    if (stayTypes.length === 0) stayTypes.push('lochside-campsite'); // Default

    // Determine area from coordinates (rough mapping)
    let areaId = 'highlands';
    if (lat && lon) {
        // Rough Scotland/Highlands detection
        if (lat > 56.5 && lat < 57.8 && lon > -5.5 && lon < -4.0) {
            // Near Loch Ness area
            if (lon < -4.5) areaId = 'south-shore';
            else areaId = 'north-shore';
        }
    }

    // Price band estimate
    const priceBand = tags.fee === 'no' ? 'budget' : 'midrange';

    return {
        id: `osm-${osmElement.id}`,
        slug: slug,
        display_name: name,
        short_description: tags.description || generateDescription(name, tags),
        latitude: lat || 57.3,
        longitude: lon || -4.5,
        area_id: areaId,
        stay_types: stayTypes,
        facility_tags: facilityTags.length > 0 ? facilityTags : ['toilets'],
        min_night_stay: 1,
        typical_price_band: priceBand,
        distance_to_loch_m: 500,
        open_months: ['April', 'May', 'June', 'July', 'August', 'September', 'October'],
        external_booking_url: tags.website || tags['contact:website'] || tags.url || `https://www.google.com/search?q=${encodeURIComponent(name + ' camping')}`,
        photos: [],  // Will be filled with Unsplash images
        address: tags['addr:full'] || tags['addr:street'] || '',
        phone: tags.phone || tags['contact:phone'] || null,
        email: tags.email || tags['contact:email'] || null
    };
}

function generateDescription(name, tags) {
    const parts = [];
    if (tags.tents === 'yes') parts.push('tent camping');
    if (tags.caravans === 'yes') parts.push('caravan pitches');
    if (tags.motorhome === 'yes') parts.push('motorhome facilities');

    if (parts.length > 0) {
        return `${name} offers ${parts.join(', ')} in a scenic location. Contact them directly for availability and booking.`;
    }
    return `${name} is a campsite offering a peaceful stay in nature. Contact them directly for availability and booking information.`;
}

async function main() {
    try {
        // Fetch all UK campsites
        const rawCampsites = await fetchCampsites();

        // Filter to only those with phone OR website
        const withContact = rawCampsites.filter(el => {
            const tags = el.tags || {};
            return (
                tags.phone ||
                tags['contact:phone'] ||
                tags.website ||
                tags['contact:website'] ||
                tags.url
            );
        });

        console.log(`Filtered to ${withContact.length} campsites with phone/website`);

        // Transform to our schema
        const campsites = withContact.map((el, i) => transformToSchema(el, i));

        // Sort by name
        campsites.sort((a, b) => a.display_name.localeCompare(b.display_name));

        // Save the data
        const outputPath = path.join(__dirname, '../data/campsites_osm.json');
        fs.writeFileSync(outputPath, JSON.stringify(campsites, null, 2));

        console.log(`Saved ${campsites.length} campsites to ${outputPath}`);

        // Print some stats
        const withPhone = campsites.filter(c => c.phone).length;
        const withWebsite = campsites.filter(c => c.external_booking_url && !c.external_booking_url.includes('google.com')).length;
        console.log(`\nStats:`);
        console.log(`  With phone: ${withPhone}`);
        console.log(`  With website: ${withWebsite}`);
        console.log(`  First few campsites:`);
        campsites.slice(0, 5).forEach(c => console.log(`    - ${c.display_name}`));

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
