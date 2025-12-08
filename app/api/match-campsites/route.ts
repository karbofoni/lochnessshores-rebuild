import { NextResponse } from 'next/server';
import { chatCompletionWithSchema, JSONSchemaResponseFormat } from '@/lib/openai';
import { getCampsites } from '@/lib/data';
import { Campsite } from '@/lib/types';

// Response schema for structured output
const matchCampsitesSchema: JSONSchemaResponseFormat = {
    type: 'json_schema',
    json_schema: {
        name: 'campsite_match_response',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                filters: {
                    type: 'object',
                    properties: {
                        area_id: { type: ['string', 'null'], description: 'Area filter if mentioned' },
                        stay_types: { type: 'array', items: { type: 'string' }, description: 'Accommodation types' },
                        facility_tags: { type: 'array', items: { type: 'string' }, description: 'Required facilities' },
                        price_band: { type: ['string', 'null'], enum: ['budget', 'midrange', 'premium', null] },
                        near_loch: { type: 'boolean', description: 'Whether lochside/near water is important' },
                    },
                    required: ['area_id', 'stay_types', 'facility_tags', 'price_band', 'near_loch'],
                    additionalProperties: false,
                },
                ranked_campsite_ids: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Top campsite IDs sorted by relevance, max 5',
                },
                explanation: {
                    type: 'string',
                    description: 'Short explanation of why these were chosen',
                },
            },
            required: ['filters', 'ranked_campsite_ids', 'explanation'],
            additionalProperties: false,
        },
    },
};

interface MatchResponse {
    filters: {
        area_id: string | null;
        stay_types: string[];
        facility_tags: string[];
        price_band: string | null;
        near_loch: boolean;
    };
    ranked_campsite_ids: string[];
    explanation: string;
}

function formatCampsiteForAI(campsite: Campsite): string {
    return `ID: ${campsite.id}
Name: ${campsite.display_name}
Area: ${campsite.area_id}
Stay types: ${campsite.stay_types.join(', ')}
Facilities: ${campsite.facility_tags.join(', ')}
Price: ${campsite.typical_price_band}
Distance to loch: ${campsite.distance_to_loch_m ? `${campsite.distance_to_loch_m}m` : 'unknown'}
Open months: ${campsite.open_months.join(', ')}
${campsite.has_drying_room ? 'Has drying room' : ''}`;
}

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const campsites = getCampsites();

        // Format campsite data for AI
        const campsiteData = campsites.map(formatCampsiteForAI).join('\n\n---\n\n');

        const systemPrompt = `You are a helpful camping expert for Loch Ness, Scotland. You match campers to campsites based on their needs.

Available areas: north-shore, south-shore, highlands, inverness
Stay types: tent, caravan, glamping, motorhome, pod, cabin
Facility tags: toilets, showers, electric-hookup, wifi, shop, pub-nearby, dog-friendly, family-friendly, campfires-allowed, fishing, water-access, quiet, scenic-views
Price bands: budget, midrange, premium

Here are all available campsites:

${campsiteData}

Based on the user's request, identify:
1. Any filters that apply (area, stay type, facilities, price, loch proximity)
2. The top 3-5 most suitable campsites (by ID), ranked by relevance
3. A brief explanation of your choices

Only recommend campsites from the provided list. Use exact IDs.`;

        const result = await chatCompletionWithSchema<MatchResponse>({
            systemPrompt,
            userMessage: query,
            schema: matchCampsitesSchema,
        });

        // Map IDs back to full campsite objects for the top picks
        const rankedCampsites = result.ranked_campsite_ids
            .map(id => campsites.find(c => c.id === id))
            .filter((c): c is Campsite => c !== undefined)
            .slice(0, 5);

        return NextResponse.json({
            ...result,
            top_campsites: rankedCampsites,
        });
    } catch (error) {
        console.error('Error matching campsites:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
