import { NextResponse } from 'next/server';
import { chatCompletionWithSchema, JSONSchemaResponseFormat } from '@/lib/openai';
import { getTrailBySlug, getTrails } from '@/lib/data';
import { Trail } from '@/lib/types';

// Response schema
const fitnessCheckSchema: JSONSchemaResponseFormat = {
    type: 'json_schema',
    json_schema: {
        name: 'trail_fitness_response',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                rating: {
                    type: 'number',
                    description: 'Suitability rating 1-5 (1=not suitable, 5=perfect match)',
                },
                verdict: {
                    type: 'string',
                    enum: ['Suitable', 'Borderline', 'Not Recommended'],
                    description: 'Quick verdict',
                },
                explanation: {
                    type: 'string',
                    description: 'Plain English explanation (2-3 sentences)',
                },
                alternative_trail_ids: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'IDs of easier/more suitable alternatives',
                },
            },
            required: ['rating', 'verdict', 'explanation', 'alternative_trail_ids'],
            additionalProperties: false,
        },
    },
};

interface FitnessResponse {
    rating: number;
    verdict: 'Suitable' | 'Borderline' | 'Not Recommended';
    explanation: string;
    alternative_trail_ids: string[];
}

function formatTrailForAI(trail: Trail): string {
    return `- ${trail.name}: ${trail.distance_miles?.toFixed(1) || trail.distance_km}mi, ${trail.difficulty}, ${trail.area_id}`;
}

export async function POST(request: Request) {
    try {
        const { trail_slug, fitness_description } = await request.json();

        if (!trail_slug || !fitness_description) {
            return NextResponse.json(
                { error: 'trail_slug and fitness_description are required' },
                { status: 400 }
            );
        }

        const trail = getTrailBySlug(trail_slug);
        if (!trail) {
            return NextResponse.json({ error: 'Trail not found' }, { status: 404 });
        }

        const allTrails = getTrails();

        // Format other trails for alternatives
        const otherTrails = allTrails
            .filter(t => t.slug !== trail_slug)
            .map(t => `ID: ${t.id} | ${formatTrailForAI(t)}`)
            .join('\n');

        const systemPrompt = `You are a Scottish Highlands hiking expert helping people assess if a trail is suitable for their fitness level.

The user wants to hike this trail:
- Name: ${trail.name}
- Distance: ${trail.distance_miles?.toFixed(1) || trail.distance_km} miles
- Difficulty: ${trail.difficulty}
- Area: ${trail.area_id}
${trail.summary ? `- Description: ${trail.summary}` : ''}

Available alternative trails (use exact IDs if suggesting):
${otherTrails}

Based on the user's fitness description:
1. Rate how suitable this trail is (1-5)
2. Give a clear verdict (Suitable / Borderline / Not Recommended)
3. Explain in plain English why (2-3 sentences, be specific about challenges)
4. If not suitable or borderline, suggest 1-2 alternative trail IDs that would be better

Be honest but friendly. Consider Scottish Highland conditions (boggy ground, exposed sections, changeable weather).`;

        const result = await chatCompletionWithSchema<FitnessResponse>({
            systemPrompt,
            userMessage: fitness_description,
            schema: fitnessCheckSchema,
        });

        // Map alternative IDs to full trail objects
        const alternatives = result.alternative_trail_ids
            .map(id => allTrails.find(t => t.id === id))
            .filter((t): t is Trail => t !== undefined);

        return NextResponse.json({
            ...result,
            alternatives,
        });
    } catch (error) {
        console.error('Trail fitness check error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
