import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars from .env.local explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Expanded bounds to cover Highlands
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const LOCH_NESS_BOUNDS = "56.5,-5.5,57.7,-3.5";

const PHOTOS = [
    "/images/glamping-pod.png",
    "/images/campervan-view.png",
    "/images/wild-tent.png",
    "/images/lochside-camp-1.png"
];

async function fetchOSMCampsites() {
    const query = `
        [out:json][timeout:60];
        (
          node["tourism"="camp_site"](${LOCH_NESS_BOUNDS});
          way["tourism"="camp_site"](${LOCH_NESS_BOUNDS});
          relation["tourism"="camp_site"](${LOCH_NESS_BOUNDS});
        );
        out center;
    `;

    console.log("Fetching from Overpass API...");
    const response = await fetch(OVERPASS_URL, {
        method: "POST",
        body: query
    });

    if (!response.ok) throw new Error("Overpass API failed");
    const data = await response.json();
    return data.elements;
}

async function enrichListing(osmElement: any) {
    const name = osmElement.tags.name || "Unnamed Campsite";
    const lat = osmElement.lat || osmElement.center?.lat;
    const lon = osmElement.lon || osmElement.center?.lon;

    if (!lat || !lon) return null;

    // Extract real contact info from OSM tags if available
    const tags = osmElement.tags;
    const phone = tags['phone'] || tags['contact:phone'] || tags['contact:mobile'];
    const email = tags['email'] || tags['contact:email'];
    const website = tags['website'] || tags['contact:website'] || tags['url'];

    // Construct address from addr:* tags
    let addressParts = [];
    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
    if (tags['addr:street']) addressParts.push(tags['addr:street']);
    if (tags['addr:city'] || tags['addr:town'] || tags['addr:village']) addressParts.push(tags['addr:city'] || tags['addr:town'] || tags['addr:village']);
    if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);
    const osmAddress = addressParts.length > 0 ? addressParts.join(', ') : null;

    // Use AI to generate unique description and fill gaps
    const tagString = JSON.stringify(tags);
    const prompt = `
        Generate a JSON entry for a campsite directory.
        Input Data (OSM Tags): ${tagString}
        Known Address: ${osmAddress || "Unknown"}
        Known Phone: ${phone || "Unknown"}

        Requirements:
        1. "slug": URL-friendly version of name.
        2. "short_description": 2 sentences, original, alluring, inviting tone. Mention specific features.
        3. "area_id": guess "south-shore", "north-shore", or "highlands" based on lat/lon.
        4. "stay_types": Array (guess based on tags: tents=yes -> "lochside-campsite", caravans=yes -> "campervan-pitch").
        5. "facility_tags": Array (guess based on tags: shower, toilets, dog=yes).
        6. "typical_price_band": "midrange" (default).
        7. "open_months": All months ["January"..."December"] if year_round, else ["April"..."October"].
        8. "address": Use known address if consistent, or improve formatting. If unknown, approximate based on location name (e.g. "Near Fort William, Highlands").
        9. "phone": Use known phone. If unknown, leave null.
        
        Output valid JSON object only matching this interface:
        {
          "id": "slug-string",
          "slug": "slug-string",
          "display_name": "Name",
          "short_description": "...",
          "latitude": number,
          "longitude": number,
          "area_id": "string",
          "stay_types": string[],
          "facility_tags": string[],
          "min_night_stay": 1,
          "typical_price_band": "string",
          "distance_to_loch_m": 500,
          "open_months": string[],
          "external_booking_url": "url",
          "photos": ["/images/lochside-camp-1.png"],
          "address": "string",
          "phone": "string"
        }
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const listing = JSON.parse(completion.choices[0].message.content || "{}");

        // Force validated real data back in over AI hallucinations
        listing.latitude = lat;
        listing.longitude = lon;
        if (phone) listing.phone = phone;
        if (website) listing.external_booking_url = website;

        // Assign random image from pool
        listing.photos = [PHOTOS[Math.floor(Math.random() * PHOTOS.length)]];

        return listing;
    } catch (e) {
        console.error(`Failed to enrich ${name}`);
        return null;
    }
}

async function main() {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.error("Error: OPENAI_API_KEY is missing.");
            process.exit(1);
        }

        const osmData = await fetchOSMCampsites();
        console.log(`Found ${osmData.length} potential campsites.`);

        const listings = [];
        const maxEntries = 120; // Target ~100

        let count = 0;
        for (const element of osmData) {
            if (count >= maxEntries) break;
            if (!element.tags || !element.tags.name) continue;

            console.log(`[${count + 1}/${Math.min(osmData.length, maxEntries)}] Processing ${element.tags.name}...`);
            const listing = await enrichListing(element);
            if (listing) {
                listings.push(listing);
                count++;
            }
            await new Promise(r => setTimeout(r, 100)); // Rate limit
        }

        const outputPath = path.join(process.cwd(), 'data', 'campsites.json');
        fs.writeFileSync(outputPath, JSON.stringify(listings, null, 2));
        console.log(`Success! Wrote ${listings.length} campsites to data/campsites.json`);

    } catch (error) {
        console.error("Script failed:", error);
    }
}

main();
