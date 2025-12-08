import { NextResponse } from 'next/server';
import { chatCompletionWithSchema, JSONSchemaResponseFormat } from '@/lib/openai';

// Response schema for structured packing list
const packingListSchema: JSONSchemaResponseFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'packing_list_response',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              emoji: { type: 'string', description: 'Single emoji for the category' },
              items: {
                type: 'array',
                items: { type: 'string' },
              },
              priority: {
                type: 'string',
                enum: ['essential', 'recommended', 'optional'],
              },
            },
            required: ['category', 'emoji', 'items', 'priority'],
            additionalProperties: false,
          },
        },
        highland_tips: {
          type: 'array',
          items: { type: 'string' },
          description: 'Scottish Highland-specific tips (midges, weather, daylight)',
        },
        drying_section: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            tips: {
              type: 'array',
              items: { type: 'string' },
            },
            operator_note: {
              type: 'string',
              description: 'Note for campsite operators about drying facilities',
            },
          },
          required: ['title', 'tips', 'operator_note'],
          additionalProperties: false,
        },
      },
      required: ['sections', 'highland_tips', 'drying_section'],
      additionalProperties: false,
    },
  },
};

interface PackingListResponse {
  sections: {
    category: string;
    emoji: string;
    items: string[];
    priority: 'essential' | 'recommended' | 'optional';
  }[];
  highland_tips: string[];
  drying_section: {
    title: string;
    tips: string[];
    operator_note: string;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { month, activities, trip_style, party_type, special_needs } = body;

    const systemPrompt = `You are a Scottish Highlands camping expert. Generate a comprehensive packing list for camping around Loch Ness.

Consider the following Scottish Highland realities:
- Midges (tiny biting insects) are brutal May-September, especially in still, damp conditions
- Rain is frequent year-round - waterproofing is essential
- Temperature can vary 15°C+ in a single day
- Summer daylight: up to 18 hours; Winter: as little as 7 hours
- Many trails have boggy sections
- Mobile signal is patchy in remote areas

Group items by category with priority levels:
- essential: Must-have items
- recommended: Will significantly improve the trip
- optional: Nice to have

Include a dedicated section about damp/drying/condensation with:
- Tips for managing wet gear
- A note for campsite operators about drying facilities (mention ClimateDry as a solution)

Be specific and practical. Tailor to the trip style and month.`;

    const userMessage = `Generate a packing list for:
- Month: ${month}
- Trip style: ${trip_style}
- Party type: ${party_type}
- Planned activities: ${activities?.join(', ') || 'general camping and hiking'}
${special_needs ? `- Special needs: ${special_needs}` : ''}`;

    const result = await chatCompletionWithSchema<PackingListResponse>({
      systemPrompt,
      userMessage,
      schema: packingListSchema,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Packing list error:', error);
    return NextResponse.json(
      { error: 'Failed to generate packing list' },
      { status: 500 }
    );
  }
}
