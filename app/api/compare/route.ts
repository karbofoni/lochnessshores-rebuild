import { NextResponse } from 'next/server';
import { chatCompletionWithSchema, JSONSchemaResponseFormat } from '@/lib/openai';
import { getCampsites, getTrails } from '@/lib/data';
import { Campsite, Trail } from '@/lib/types';

// Response schema
const compareSchema: JSONSchemaResponseFormat = {
    type: 'json_schema',
    json_schema: {
        name: 'compare_response',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                narrative: {
                    type: 'string',
                    description: 'Short comparison narrative (2-3 sentences)',
                },
                comparison_points: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            aspect: { type: 'string' },
                            items: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        value: { type: 'string' },
                                        winner: { type: 'boolean' },
                                    },
                                    required: ['id', 'value', 'winner'],
                                    additionalProperties: false,
                                },
                            },
                        },
                        required: ['aspect', 'items'],
                        additionalProperties: false,
                    },
                },
                best_for: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            suits: { type: 'string' },
                        },
                        required: ['id', 'suits'],
                        additionalProperties: false,
                    },
                    description: 'Who each option is best suited for',
                },
            },
            required: ['narrative', 'comparison_points', 'best_for'],
            additionalProperties: false,
        },
    },
};

interface CompareResponse {
    narrative: string;
    comparison_points: {
        aspect: string;
        items: { id: string; value: string; winner: boolean }[];
    }[];
    best_for: { id: string; suits: string }[];
}

function formatCampsite(c: Campsite): string {
    return `ID: ${c.id}
Name: ${c.display_name}
Area: ${c.area_id}
Types: ${c.stay_types.join(', ')}
Facilities: ${c.facility_tags.join(', ')}
Price: ${c.typical_price_band}
Distance to loch: ${c.distance_to_loch_m ? `${c.distance_to_loch_m}m` : 'unknown'}`;
}

function formatTrail(t: Trail): string {
    return `ID: ${t.id}
Name: ${t.name}
Distance: ${t.distance_miles?.toFixed(1) || t.distance_km} miles
Difficulty: ${t.difficulty}
Area: ${t.area_id}
Summary: ${t.summary || 'A scenic trail around Loch Ness'}`;
}

export async function POST(request: Request) {
    try {
        const { type, ids } = await request.json();

        if (!type || !ids || !Array.isArray(ids) || ids.length < 2) {
            return NextResponse.json(
                { error: 'type and ids (array of 2-3) are required' },
                { status: 400 }
            );
        }

        if (ids.length > 3) {
            return NextResponse.json(
                { error: 'Maximum 3 items can be compared' },
                { status: 400 }
            );
        }

        let items: (Campsite | Trail)[];
        let formattedItems: string;

        if (type === 'campsite') {
            const campsites = getCampsites();
            items = ids.map(id => campsites.find(c => c.id === id)).filter((c): c is Campsite => c !== undefined);
            formattedItems = items.map(c => formatCampsite(c as Campsite)).join('\n\n---\n\n');
        } else if (type === 'trail') {
            const trails = getTrails();
            items = ids.map(id => trails.find(t => t.id === id)).filter((t): t is Trail => t !== undefined);
            formattedItems = items.map(t => formatTrail(t as Trail)).join('\n\n---\n\n');
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        if (items.length < 2) {
            return NextResponse.json({ error: 'Could not find enough items' }, { status: 404 });
        }

        const systemPrompt = `You are helping campers compare ${type}s around Loch Ness.

Compare these ${type}s:
${formattedItems}

Provide:
1. A narrative comparison (2-3 sentences, conversational)
2. Key comparison points (price, facilities, location, etc.)
3. Who each option is best suited for

Be practical and helpful. Focus on tangible differences.`;

        const result = await chatCompletionWithSchema<CompareResponse>({
            systemPrompt,
            userMessage: `Compare these ${items.length} ${type}s and tell me the key differences.`,
            schema: compareSchema,
        });

        return NextResponse.json({
            ...result,
            items: items.map(item => ({
                id: 'id' in item ? item.id : '',
                name: 'display_name' in item ? item.display_name : ('name' in item ? item.name : ''),
                slug: 'slug' in item ? item.slug : '',
            })),
        });
    } catch (error) {
        console.error('Compare error:', error);
        return NextResponse.json(
            { error: 'Failed to compare items' },
            { status: 500 }
        );
    }
}
