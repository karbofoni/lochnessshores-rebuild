/**
 * Finalize campsite data with Unsplash images
 * Uses curated free Unsplash image URLs for camping
 */

const fs = require('fs');
const path = require('path');

// Curated Unsplash images - free to use with attribution
// All from Unsplash.com - licensed for free commercial use
const CAMPING_IMAGES = [
    // Tent camping
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526491109649-aa0f504a37fe?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517823382935-51bfcb0ec6bc?w=800&h=600&fit=crop',
    // Scottish highlands / nature
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&h=600&fit=crop',
    // Campervans / caravans
    'https://images.unsplash.com/photo-1533309907656-7b1c2ee56ddf?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop',
    // Nature / outdoors
    'https://images.unsplash.com/photo-1475483768296-6163e08872a1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1487730116445-500c1b8d0e05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&h=600&fit=crop'
];

// Additional areas for better categorization
const AREAS = ['north-shore', 'south-shore', 'highlands', 'loch-ness'];

function assignImages(campsites) {
    return campsites.map((site, index) => {
        // Assign a consistent image based on site ID hash
        const imageIndex = Math.abs(hashCode(site.id)) % CAMPING_IMAGES.length;
        return {
            ...site,
            photos: [CAMPING_IMAGES[imageIndex]],
            area_id: AREAS[Math.abs(hashCode(site.id + 'area')) % AREAS.length]
        };
    });
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

function main() {
    // Load OSM campsites
    const osmPath = path.join(__dirname, '../data/campsites_osm.json');
    const rawData = fs.readFileSync(osmPath, 'utf8');
    const campsites = JSON.parse(rawData);

    console.log(`Loaded ${campsites.length} campsites from OSM data`);

    // Assign images and update areas
    const finalCampsites = assignImages(campsites);

    // Save to main campsites.json
    const outputPath = path.join(__dirname, '../data/campsites.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalCampsites, null, 2));

    console.log(`Saved ${finalCampsites.length} campsites to ${outputPath}`);
    console.log('\nSample campsite:');
    console.log(JSON.stringify(finalCampsites[0], null, 2));

    // Stats
    const withPhone = finalCampsites.filter(c => c.phone).length;
    const withEmail = finalCampsites.filter(c => c.email).length;
    const withRealWebsite = finalCampsites.filter(c =>
        c.external_booking_url && !c.external_booking_url.includes('google.com')
    ).length;

    console.log('\nFinal Stats:');
    console.log(`  Total: ${finalCampsites.length}`);
    console.log(`  With phone: ${withPhone}`);
    console.log(`  With email: ${withEmail}`);
    console.log(`  With website: ${withRealWebsite}`);
}

main();
