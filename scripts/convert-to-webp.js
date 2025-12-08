const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const GENERATED_DIR = path.join(__dirname, '../public/images/generated');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

async function convertToWebP() {
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.png'));
    console.log(`Converting ${files.length} PNG files to WebP...`);

    let converted = 0;
    let totalSavedBytes = 0;

    for (const file of files) {
        const inputPath = path.join(GENERATED_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file.replace('.png', '.webp'));

        try {
            const inputStats = fs.statSync(inputPath);

            await sharp(inputPath)
                .resize(800, 600, {
                    fit: 'cover',
                    withoutEnlargement: true
                })
                .webp({
                    quality: 80,
                    effort: 6
                })
                .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const savedBytes = inputStats.size - outputStats.size;
            totalSavedBytes += savedBytes;

            converted++;
            if (converted % 50 === 0) {
                console.log(`Converted ${converted}/${files.length}...`);
            }
        } catch (error) {
            console.error(`Error converting ${file}:`, error.message);
        }
    }

    const savedMB = (totalSavedBytes / 1024 / 1024).toFixed(2);
    console.log(`\\nDone! Converted ${converted} images.`);
    console.log(`Total space saved: ${savedMB} MB`);
}

convertToWebP();
