import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { origin_city, trip_length_days, travel_style, month, interests } = body;

        const prompt = `You are a Scottish Highlands travel expert. Create a ${trip_length_days}-day trip itinerary from ${origin_city} to Loch Ness for a ${travel_style} traveler in ${month}.

Interests: ${interests?.join(', ') || 'general sightseeing'}

For each day, provide:
- Day title
- Description (2-3 sentences)
- Suggested campsite slugs (use realistic slugs like "loch-ness-shores", "forest-glen-holiday-park")
- Suggested activities

Return JSON in this exact format:
{
  "summary": "Brief trip summary",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Description",
      "suggested_campsites": ["campsite-slug-1"],
      "activities": ["activity 1", "activity 2"]
    }
  ]
}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');
        return NextResponse.json(result);
    } catch (error) {
        console.error('Trip planner error:', error);
        return NextResponse.json(
            { error: 'Failed to generate trip plan' },
            { status: 500 }
        );
    }
}
