const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const dotenv = require('dotenv');

// Load env vars
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`Loading .env from ${envPath}`);

if (fs.existsSync(envPath)) {
    // Check for BOM or try reading as utf16le if utf8 fails
    let envConfig;
    try {
        const buffer = fs.readFileSync(envPath);
        // Check for UTF-16 LE BOM (FF FE)
        if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
            envConfig = buffer.toString('utf16le');
        } else {
            envConfig = buffer.toString('utf8');
        }
    } catch (e) {
        console.error("Error reading .env.local:", e);
    }

    if (envConfig) {
        envConfig.split(/\r?\n/).forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                process.env[key] = value;
            }
        });
    }
}
console.log("OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);

const TRAILS_PATH = path.join(__dirname, '../data/trails.json');

async function main() {
    if (!process.env.OPENAI_API_KEY) {
        // Try reading from just .env if .env.local failed or missing
        const envPath2 = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath2)) {
            const envConfig = fs.readFileSync(envPath2, 'utf8');
            envConfig.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
                }
            });
        }
    }

    if (!process.env.OPENAI_API_KEY) {
        console.error("Error: OPENAI_API_KEY is missing from process.env");
        process.exit(1);
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("Reading trails...");
    const rawData = fs.readFileSync(TRAILS_PATH, 'utf8');
    const trails = JSON.parse(rawData);

    console.log(`Found ${trails.length} trails.`);

    const trailsToProcess = trails;
    let updatedCount = 0;
    const BATCH_SIZE = 5;

    for (let i = 0; i < trailsToProcess.length; i += BATCH_SIZE) {
        const batch = trailsToProcess.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${i + 1}-${Math.min(i + BATCH_SIZE, trailsToProcess.length)})...`);

        await Promise.all(batch.map(async (trail) => {
            if (trail.highlights && trail.highlights.length > 0) return;

            try {
                const prompt = `
                    Generate 3-4 short, engaging highlights (3-6 words each) for a hiking trail.
                    Trail Name: "${trail.name}"
                    Area: "${trail.area_id}"
                    Summary: "${trail.summary}"
                    Difficulty: "${trail.difficulty}"
                    
                    Return ONLY a JSON array of strings. Example: ["Scenic Loch Views", "Easy Forest Walk", "Dog Friendly", "Waterfall Nearby"]
                `;

                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                });

                const content = completion.choices[0].message.content;
                const cleanContent = content.replace(/```json|```/g, '').trim();

                let highlights = [];
                try {
                    highlights = JSON.parse(cleanContent);
                } catch (e) {
                    console.error(`Failed to parse JSON for ${trail.name}: ${content}`);
                    highlights = ["Scenic Views", "Nature Walk", "Wilderness"];
                }

                if (Array.isArray(highlights)) {
                    trail.highlights = highlights.slice(0, 4);
                    updatedCount++;
                }

            } catch (err) {
                console.error(`Error processing ${trail.name}:`, err.message);
            }
        }));

        await new Promise(r => setTimeout(r, 1000));

        if (i % 50 === 0) {
            fs.writeFileSync(TRAILS_PATH, JSON.stringify(trails, null, 2));
            console.log(`Saved intermediate progress...`);
        }
    }

    fs.writeFileSync(TRAILS_PATH, JSON.stringify(trails, null, 2));
    console.log(`\nSuccess! Updated ${updatedCount} trails with new highlights.`);
}

main();
