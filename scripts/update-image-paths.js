const fs = require('fs');
const path = require('path');

// Update campsites.json
const campsitesPath = path.join(__dirname, '../data/campsites.json');
const campsites = JSON.parse(fs.readFileSync(campsitesPath, 'utf8'));

campsites.forEach(campsite => {
    if (campsite.photos && campsite.photos.length > 0) {
        campsite.photos = campsite.photos.map(photo => {
            if (photo.includes('/images/generated/') && photo.endsWith('.png')) {
                return photo.replace('/images/generated/', '/images/optimized/').replace('.png', '.webp');
            }
            return photo;
        });
    }
});

fs.writeFileSync(campsitesPath, JSON.stringify(campsites, null, 2));
console.log(`Updated ${campsites.length} campsites to use WebP images`);

// Update trails.json
const trailsPath = path.join(__dirname, '../data/trails.json');
const trails = JSON.parse(fs.readFileSync(trailsPath, 'utf8'));

trails.forEach(trail => {
    if (trail.photos && trail.photos.length > 0) {
        trail.photos = trail.photos.map(photo => {
            if (photo.includes('/images/generated/') && photo.endsWith('.png')) {
                return photo.replace('/images/generated/', '/images/optimized/').replace('.png', '.webp');
            }
            return photo;
        });
    }
});

fs.writeFileSync(trailsPath, JSON.stringify(trails, null, 2));
console.log(`Updated ${trails.length} trails to use WebP images`);

console.log('Done!');
