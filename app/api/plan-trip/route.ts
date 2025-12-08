import { NextResponse } from 'next/server';
import { chatCompletionWithSchema, JSONSchemaResponseFormat } from '@/lib/openai';
import { getCampsites, getTrails, getExtras } from '@/lib/data';

// Response schema for structured itinerary
const tripPlanSchema: JSONSchemaResponseFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'trip_plan_response',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          description: 'Brief 2-3 sentence trip summary',
        },
        days: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              day: { type: 'number' },
              title: { type: 'string' },
              description: { type: 'string' },
              campsite_ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'IDs of suggested campsites from the provided list',
              },
              trail_ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'IDs of suggested trails from the provided list',
              },
              extra_ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'IDs of extras (pubs, activities) from the provided list',
              },
              activities: {
                type: 'array',
                items: { type: 'string' },
                description: 'Other activities or tips for the day',
              },
            },
            required: ['day', 'title', 'description', 'campsite_ids', 'trail_ids', 'extra_ids', 'activities'],
            additionalProperties: false,
          },
        },
        packing_tips: {
          type: 'array',
          items: { type: 'string' },
          description: 'Key items to pack based on trip style and month',
        },
      },
      required: ['summary', 'days', 'packing_tips'],
      additionalProperties: false,
    },
  },
};

interface TripPlanResponse {
  summary: string;
  days: {
    day: number;
    title: string;
    description: string;
    campsite_ids: string[];
    trail_ids: string[];
    extra_ids: string[];
    activities: string[];
  }[];
  packing_tips: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { origin_city, trip_length_days, travel_style, month, interests } = body;

    // Get real data
    const campsites = getCampsites();
    const trails = getTrails();
    const extras = getExtras();

    // Format data for AI
    const campsiteData = campsites.map(c =>
      `ID: ${c.id} | Name: ${c.display_name} | Area: ${c.area_id} | Types: ${c.stay_types.join(', ')} | Price: ${c.typical_price_band}`
    ).join('\n');

    const trailData = trails.map(t =>
      `ID: ${t.id} | Name: ${t.name} | Distance: ${t.distance_miles?.toFixed(1) || t.distance_km}mi | Difficulty: ${t.difficulty} | Area: ${t.area_id}`
    ).join('\n');

    const extraData = extras.map(e =>
      `ID: ${e.id} | Name: ${e.name} | Type: ${e.type} | Area: ${e.area_id}`
    ).join('\n');

    const systemPrompt = `You are a Scottish Highlands travel expert creating personalized Loch Ness trip itineraries.

You MUST only use IDs from the provided lists below. Do not make up any IDs.

=== AVAILABLE CAMPSITES ===
${campsiteData}

=== AVAILABLE TRAILS ===
${trailData}

=== AVAILABLE EXTRAS (pubs, shops, activities) ===
${extraData}

Create a ${trip_length_days}-day trip itinerary for a ${travel_style} traveler visiting in ${month}.
${interests?.length > 0 ? `Their interests: ${interests.join(', ')}` : ''}

Guidelines:
- Each day should have 1-2 campsite suggestions (use actual IDs from the list)
- Include 1-2 trails per day appropriate for the travel style
- Suggest relevant extras (pubs, shops, activities)
- Consider geographical proximity when planning
- Add practical activities and tips
- Include Highland-specific packing tips (midges, rain, layers)`;

    const result = await chatCompletionWithSchema<TripPlanResponse>({
      systemPrompt,
      userMessage: `Create a trip plan from ${origin_city} with ${trip_length_days} days in ${month} for a ${travel_style} traveler.`,
      schema: tripPlanSchema,
    });

    // Enrich the response with full objects
    const enrichedDays = result.days.map(day => ({
      ...day,
      campsites: day.campsite_ids
        .map(id => campsites.find(c => c.id === id))
        .filter(Boolean),
      trails: day.trail_ids
        .map(id => trails.find(t => t.id === id))
        .filter(Boolean),
      extras: day.extra_ids
        .map(id => extras.find(e => e.id === id))
        .filter(Boolean),
    }));

    return NextResponse.json({
      summary: result.summary,
      days: enrichedDays,
      packing_tips: result.packing_tips,
    });
  } catch (error) {
    console.error('Trip planner error:', error);
    return NextResponse.json(
      { error: 'Failed to generate trip plan' },
      { status: 500 }
    );
  }
}
