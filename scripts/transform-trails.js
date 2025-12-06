/**
 * Transform trails data to match expected schema
 */

const fs = require('fs');
const path = require('path');

const trailsPath = path.join(__dirname, '../data/trails.json');
const rawData = fs.readFileSync(trailsPath, 'utf8');
const trails = JSON.parse(rawData);

console.log(`Transforming ${trails.length} trails...`);

// Transform to match expected Trail interface
const transformedTrails = trails.map(trail => ({
    id: trail.id,
    slug: trail.slug,
    name: trail.name,
    distance_km: trail.distance_km || 5,
    difficulty: trail.difficulty === 'moderate' ? 'Moderate' :
        trail.difficulty === 'easy' ? 'Easy' :
            trail.difficulty === 'hard' ? 'Desperate' : 'Moderate',
    area_id: trail.area_id,
    description: trail.summary || trail.description || `${trail.name} is a scenic trail with beautiful views.`,
    summary: trail.summary || `${trail.name} - ${trail.distance_km || 5}km trail`,
    highlights: [],
    notes: 'Data sourced from OpenStreetMap',
    start_point_lat: trail.latitude || 57.3,
    start_point_lng: trail.longitude || -4.5,
    nearby_campsite_ids: [],
    type: 'hiking',
    photos: trail.photos || []
}));

fs.writeFileSync(trailsPath, JSON.stringify(transformedTrails, null, 2));
console.log(`Saved ${transformedTrails.length} transformed trails`);
console.log('Sample:', JSON.stringify(transformedTrails[0], null, 2));
