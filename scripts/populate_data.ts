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

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const LOCH_NESS_BOUNDS = "57.0,-4.8,57.5,-4.2"; // South/West/North/East approx

async function fetchOSMCampsites() {
    const query = `
        [out:json][timeout:25];
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

    // Use AI to generate unique description based on tags (avoid scraping)
    const tags = JSON.stringify(osmElement.tags);
    const prompt = `
        Generate a JSON entry for a campsite directory.
        Input Data (OSM Tags): ${tags}
        
        Requirements:
        1. "slug": URL-friendly version of name.
        2. "short_description": 2 sentences, original, alluring, inviting tone. Mention specific features from tags (e.g. lakeside if near water). Do NOT invent facts.
        3. "area_id": "south-shore" if lat < 57.25, else "north-shore".
        4. "stay_types": Array (guess based on tags: tents=yes -> "lochside-campsite", caravans=yes -> "campervan-pitch").
        5. "facility_tags": Array (guess based on tags: shower, toilets, dog=yes).
        6. "typical_price_band": "midrange" (default).
        7. "open_months": All months ["January"..."December"] if year_round, else ["April"..."October"].
        
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
          "external_booking_url": "website or google search url",
          "photos": ["/images/lochside-camp-1.png"] 
        }
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const listing = JSON.parse(completion.choices[0].message.content || "{}");
        // Force valid coords and add real photo placeholder cycle
        listing.latitude = lat;
        listing.longitude = lon;
        listing.photos = ["/images/lochside-camp-1.png"];

        return listing;
    } catch (e) {
        console.error(`Failed to enrich ${name}`);
        return null;
    }
}

async function main() {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.error("Error: OPENAI_API_KEY is missing from environment. Script cannot run.");
            process.exit(1);
        }

        const osmData = await fetchOSMCampsites();
        console.log(`Found ${osmData.length} potential campsites.`);

        const listings = [];
        for (const element of osmData) {
            if (!element.tags || !element.tags.name) continue;
            console.log(`Processing ${element.tags.name}...`);
            const listing = await enrichListing(element);
            if (listing) listings.push(listing);
            // Rate limit simple
            await new Promise(r => setTimeout(r, 500));
        }

        const outputPath = path.join(process.cwd(), 'data', 'campsites.json');
        fs.writeFileSync(outputPath, JSON.stringify(listings, null, 2));
        console.log(`Success! Wrote ${listings.length} campsites to data/campsites.json`);

    } catch (error) {
        console.error("Script failed:", error);
    }
}

main();
