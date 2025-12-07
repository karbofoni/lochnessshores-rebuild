const fs = require('fs');
const path = require('path');

const trailsPath = path.join(__dirname, '../data/trails.json');
const generatedImagesPath = path.join(__dirname, '../public/images/generated');

// Read trails data
const trails = JSON.parse(fs.readFileSync(trailsPath, 'utf8'));

// Read generated images
const generatedImages = fs.readdirSync(generatedImagesPath);

let updatedCount = 0;

const updatedTrails = trails.map(trail => {
    // Construct expected image filename
    // Slug: "abercorn-street-north" -> Filename: "trail_abercorn_street_north.png"
    const expectedFilename = `trail_${trail.slug.replace(/-/g, '_')}.png`;

    if (generatedImages.includes(expectedFilename)) {
        console.log(`Found image for ${trail.name}: ${expectedFilename}`);
        updatedCount++;
        return {
            ...trail,
            photos: [`/images/generated/${expectedFilename}`] // Override photos
        };
    } else {
        // console.log(`No local image found for ${trail.name} (${expectedFilename}), keeping existing.`);
        return trail;
    }
});

fs.writeFileSync(trailsPath, JSON.stringify(updatedTrails, null, 2));

console.log(`Updated ${updatedCount} trails with local generated images.`);
