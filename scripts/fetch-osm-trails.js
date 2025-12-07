/**
 * OpenStreetMap Trails Data Extractor
 * Fetches UK hiking trails from Overpass API
 */

const fs = require('fs');
const path = require('path');

// Overpass API endpoint
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Query for UK hiking trails/routes with useful data
const OVERPASS_QUERY = `
[out:json][timeout:300];
(
  relation["route"="hiking"](around:50000, 57.3, -4.5);
  relation["route"="foot"](around:50000, 57.3, -4.5);
  way["highway"="path"]["name"](around:50000, 57.3, -4.5);
);
out geom tags;
`;

async function fetchTrails() {
    console.log('Fetching UK trails from OpenStreetMap...');

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
    console.log(`Fetched ${data.elements.length} raw trails`);
    return data.elements;
}

// Curated Unsplash trail images
const TRAIL_IMAGES = [
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&h=600&fit=crop'
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

function calculateDistance(points) {
    if (!points || points.length < 2) return 0;

    const R = 6371; // Earth radius in km
    let totalDist = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const lat1 = points[i].lat * Math.PI / 180;
        const lon1 = points[i].lon * Math.PI / 180;
        const lat2 = points[i + 1].lat * Math.PI / 180;
        const lon2 = points[i + 1].lon * Math.PI / 180;

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        totalDist += R * c;
    }
    return totalDist;
}

function transformToSchema(osmElement, index) {
    const tags = osmElement.tags || {};

    // Get geometry points
    let points = [];
    if (osmElement.type === 'way' && osmElement.geometry) {
        points = osmElement.geometry;
    } else if (osmElement.members) {
        // Simple handling for relations and other types
        osmElement.members.forEach(m => {
            if (m.geometry) points.push(...m.geometry);
        });
    }

    // Determine center/start
    const lat = osmElement.lat || osmElement.center?.lat || (points.length > 0 ? points[0].lat : 57.3);
    const lon = osmElement.lon || osmElement.center?.lon || (points.length > 0 ? points[0].lon : -4.5);

    const name = tags.name || `Trail ${osmElement.id}`;
    const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);

    // Extract difficulty
    let difficulty = 'moderate';
    if (tags.sac_scale) {
        if (tags.sac_scale.includes('hiking')) difficulty = 'easy';
        else if (tags.sac_scale.includes('mountain') || tags.sac_scale.includes('alpine')) difficulty = 'hard';
    }
    if (tags.trail_visibility === 'excellent') difficulty = 'easy';

    // Calculate real distance
    let distanceKm = 0;
    if (tags.distance) {
        const match = tags.distance.match(/(\d+\.?\d*)/);
        if (match) distanceKm = parseFloat(match[1]);
    }

    // If no tag, calculate from geometry
    if (!distanceKm && points.length > 1) {
        distanceKm = calculateDistance(points);
    }
    if (!distanceKm) distanceKm = 5; // Fallback

    // Convert to miles
    const distanceMiles = parseFloat((distanceKm * 0.621371).toFixed(1));

    const imageIndex = Math.abs(hashCode(`trail-${osmElement.id}`)) % TRAIL_IMAGES.length;
    const areaIndex = Math.abs(hashCode(`area-${osmElement.id}`)) % AREAS.length;

    // Simplify geometry for frontend (array of [lat, lon])
    const geometry = points.map(p => [p.lat, p.lon]);

    return {
        id: `osm-trail-${osmElement.id}`,
        slug: slug,
        name: name,
        summary: tags.description || `${name} is a scenic trail offering beautiful views. Check local conditions before heading out.`,
        area_id: AREAS[areaIndex],
        difficulty: difficulty,
        distance_km: parseFloat(distanceKm.toFixed(1)),
        distance_miles: distanceMiles, // New field
        duration_hours: Math.round(distanceKm / 4 * 10) / 10,
        elevation_gain_m: parseInt(tags.ascent) || Math.round(distanceKm * 30),
        latitude: lat,
        longitude: lon,
        photos: [TRAIL_IMAGES[imageIndex]],
        gpx_url: null,
        external_url: tags.website || tags.url || null,
        geometry: geometry // New field
    };
}

async function main() {
    try {
        const rawTrails = await fetchTrails();

        // Filter to those with names
        const namedTrails = rawTrails.filter(el => el.tags?.name);
        console.log(`Filtered to ${namedTrails.length} named trails`);

        // Limit to first 500 to keep manageable
        const limitedTrails = namedTrails.slice(0, 500);

        const trails = limitedTrails.map((el, i) => transformToSchema(el, i));

        // Remove duplicates by name
        const uniqueTrails = [];
        const seenNames = new Set();
        for (const trail of trails) {
            if (!seenNames.has(trail.name.toLowerCase())) {
                seenNames.add(trail.name.toLowerCase());
                uniqueTrails.push(trail);
            }
        }

        console.log(`After dedup: ${uniqueTrails.length} unique trails`);

        // Sort by name
        uniqueTrails.sort((a, b) => a.name.localeCompare(b.name));

        const outputPath = path.join(__dirname, '../data/trails.json');
        fs.writeFileSync(outputPath, JSON.stringify(uniqueTrails, null, 2));

        console.log(`Saved ${uniqueTrails.length} trails to ${outputPath}`);
        console.log('\nSample trail:');
        console.log(JSON.stringify(uniqueTrails[0], null, 2));

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
