/**
 * Expanded Unsplash image collection for camping sites
 * 50+ curated high-quality camping and Scotland landscape images
 * All from Unsplash.com - free for commercial use
 */

const fs = require('fs');
const path = require('path');

// EXPANDED: 50+ Unsplash camping and Scotland images
const CAMPING_IMAGES = [
    // Tent Camping (15 images)
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop', // tent in mountains
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop', // tent by lake
    'https://images.unsplash.com/photo-1526491109649-aa0f504a37fe?w=800&h=600&fit=crop', // tent at sunset
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop', // forest tent
    'https://images.unsplash.com/photo-1517823382935-51bfcb0ec6bc?w=800&h=600&fit=crop', // camping fire
    'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800&h=600&fit=crop', // tent wilderness
    'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800&h=600&fit=crop', // tent view
    'https://images.unsplash.com/photo-1496545672447-f699b503d270?w=800&h=600&fit=crop', // camping morning
    'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&h=600&fit=crop', // night camping
    'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&h=600&fit=crop', // camping starry
    'https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?w=800&h=600&fit=crop', // tent landscape
    'https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=800&h=600&fit=crop', // camping adventure
    'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=800&h=600&fit=crop', // tent morning light
    'https://images.unsplash.com/photo-1520960858461-ac671067213e?w=800&h=600&fit=crop', // camping gear
    'https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?w=800&h=600&fit=crop', // tent meadow

    // Campervans & Caravans (10 images)
    'https://images.unsplash.com/photo-1533309907656-7b1c2ee56ddf?w=800&h=600&fit=crop', // campervan
    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop', // van life
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', // road trip van
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop', // caravan park
    'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop', // motorhome
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop', // camper scenic
    'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800&h=600&fit=crop', // vintage van
    'https://images.unsplash.com/photo-1578687879057-3dac12c1f7f6?w=800&h=600&fit=crop', // van sunset
    'https://images.unsplash.com/photo-1515789634223-aa8f6e12f04e?w=800&h=600&fit=crop', // camping van
    'https://images.unsplash.com/photo-1596395463273-7fc4db20ebe9?w=800&h=600&fit=crop', // caravan site

    // Scottish Highlands & Landscapes (15 images)
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // highlands
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop', // Scottish forest
    'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&h=600&fit=crop', // loch view
    'https://images.unsplash.com/photo-1475483768296-6163e08872a1?w=800&h=600&fit=crop', // mountain lake
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&h=600&fit=crop', // Scotland misty
    'https://images.unsplash.com/photo-1487730116445-500c1b8d0e05?w=800&h=600&fit=crop', // green hills
    'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?w=800&h=600&fit=crop', // lake sunset
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', // mountain peak
    'https://images.unsplash.com/photo-1439853949127-fa647f41727c?w=800&h=600&fit=crop', // highlands moor
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', // scenic lake
    'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&h=600&fit=crop', // valley
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=600&fit=crop', // river
    'https://images.unsplash.com/photo-1449791842668-9edf8a20e863?w=800&h=600&fit=crop', // morning mist
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&h=600&fit=crop', // sunset hills
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop', // deer scotland

    // Outdoor Activities (10 images)
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop', // hiking
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop', // trail
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&h=600&fit=crop', // trekking
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop', // walking path
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=600&fit=crop', // forest walk
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', // sunlit forest
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&h=600&fit=crop', // autumn trail
    'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=800&h=600&fit=crop', // boots hiking
    'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&h=600&fit=crop', // backpack
    'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=600&fit=crop'  // mountain view
];

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

function reassignImages() {
    // Update campsites
    const campsitesPath = path.join(__dirname, '../data/campsites.json');
    let campsites = JSON.parse(fs.readFileSync(campsitesPath, 'utf8'));

    campsites = campsites.map(site => {
        const imageIndex = Math.abs(hashCode(site.id)) % CAMPING_IMAGES.length;
        return { ...site, photos: [CAMPING_IMAGES[imageIndex]] };
    });

    fs.writeFileSync(campsitesPath, JSON.stringify(campsites, null, 2));
    console.log(`Updated ${campsites.length} campsites with ${CAMPING_IMAGES.length} image options`);

    // Update trails
    const trailsPath = path.join(__dirname, '../data/trails.json');
    let trails = JSON.parse(fs.readFileSync(trailsPath, 'utf8'));

    // Use outdoor activity images for trails (indices 40-49)
    const TRAIL_IMAGES = CAMPING_IMAGES.slice(40);
    trails = trails.map(trail => {
        const imageIndex = Math.abs(hashCode(trail.id)) % TRAIL_IMAGES.length;
        return { ...trail, photos: [TRAIL_IMAGES[imageIndex]] };
    });

    fs.writeFileSync(trailsPath, JSON.stringify(trails, null, 2));
    console.log(`Updated ${trails.length} trails with hiking/outdoor images`);

    // Update extras
    const extrasPath = path.join(__dirname, '../data/extras.json');
    let extras = JSON.parse(fs.readFileSync(extrasPath, 'utf8'));

    // Use landscape images for extras (indices 25-39)
    const EXTRA_IMAGES = CAMPING_IMAGES.slice(25, 40);
    extras = extras.map(extra => {
        const imageIndex = Math.abs(hashCode(extra.id)) % EXTRA_IMAGES.length;
        return { ...extra, photos: [EXTRA_IMAGES[imageIndex]] };
    });

    fs.writeFileSync(extrasPath, JSON.stringify(extras, null, 2));
    console.log(`Updated ${extras.length} extras with landscape images`);

    console.log(`\nTotal unique images available: ${CAMPING_IMAGES.length}`);
}

reassignImages();
