/**
 * OpenStreetMap Extras (Activities/Services) Data Extractor
 * Fetches UK attractions, cafes, shops near camping areas
 */

const fs = require('fs');
const path = require('path');

// Overpass API endpoint
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Query for UK tourism attractions and amenities in Scottish Highlands
const OVERPASS_QUERY = `
[out:json][timeout:300];
area["name"="Scotland"]->.scot;
(
  node["tourism"="attraction"](area.scot);
  node["tourism"="museum"](area.scot);
  node["tourism"="viewpoint"](area.scot);
  node["amenity"="cafe"]["name"](area.scot);
  node["shop"~"outdoor|bicycle|general"]["name"](area.scot);
  node["leisure"="water_park"](area.scot);
  node["sport"="fishing"](area.scot);
);
out center tags;
`;

async function fetchExtras() {
    console.log('Fetching Scotland attractions/services from OpenStreetMap...');

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
    console.log(`Fetched ${data.elements.length} raw extras`);
    return data.elements;
}

// Curated Unsplash images for extras
const ACTIVITY_IMAGES = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1495954222046-2c427ecb546d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517632148610-5aa39e0e2932?w=800&h=600&fit=crop'
];

const AREAS = ['north-shore', 'south-shore', 'highlands', 'loch-ness'];

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

function determineType(tags) {
    if (tags.tourism === 'attraction' || tags.tourism === 'museum') return 'attraction';
    if (tags.tourism === 'viewpoint') return 'viewpoint';
    if (tags.amenity === 'cafe') return 'cafe';
    if (tags.shop) return 'shop';
    if (tags.sport === 'fishing') return 'activity';
    return 'activity';
}

function transformToSchema(osmElement) {
    const tags = osmElement.tags || {};
    const lat = osmElement.lat || osmElement.center?.lat;
    const lon = osmElement.lon || osmElement.center?.lon;

    const name = tags.name || `Place ${osmElement.id}`;
    const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);

    const imageIndex = Math.abs(hashCode(`extra-${osmElement.id}`)) % ACTIVITY_IMAGES.length;
    const areaIndex = Math.abs(hashCode(`area-${osmElement.id}`)) % AREAS.length;

    return {
        id: `osm-extra-${osmElement.id}`,
        slug: slug,
        name: name,
        category: determineType(tags),
        type: determineType(tags),
        summary: tags.description || `${name} - a local ${determineType(tags)} in Scotland. Contact them for opening hours.`,
        description: tags.description || `Visit ${name} for a great experience in the Scottish Highlands.`,
        area_id: AREAS[areaIndex],
        latitude: lat || 57.3,
        longitude: lon || -4.5,
        photos: [ACTIVITY_IMAGES[imageIndex]],
        website_url: tags.website || tags.url || null,
        phone: tags.phone || tags['contact:phone'] || null
    };
}

async function main() {
    try {
        const rawExtras = await fetchExtras();

        // Filter to those with names and contact info
        const namedExtras = rawExtras.filter(el => {
            const tags = el.tags || {};
            return tags.name && (tags.website || tags.phone || tags.url);
        });
        console.log(`Filtered to ${namedExtras.length} extras with name + contact`);

        // Transform and deduplicate
        const extras = namedExtras.map(el => transformToSchema(el));

        const uniqueExtras = [];
        const seenNames = new Set();
        for (const extra of extras) {
            if (!seenNames.has(extra.name.toLowerCase())) {
                seenNames.add(extra.name.toLowerCase());
                uniqueExtras.push(extra);
            }
        }

        console.log(`After dedup: ${uniqueExtras.length} unique extras`);

        // Sort by name
        uniqueExtras.sort((a, b) => a.name.localeCompare(b.name));

        const outputPath = path.join(__dirname, '../data/extras.json');
        fs.writeFileSync(outputPath, JSON.stringify(uniqueExtras, null, 2));

        console.log(`Saved ${uniqueExtras.length} extras to ${outputPath}`);
        console.log('\nSample extra:');
        if (uniqueExtras.length > 0) {
            console.log(JSON.stringify(uniqueExtras[0], null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
