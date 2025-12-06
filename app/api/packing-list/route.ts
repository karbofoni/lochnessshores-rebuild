import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { month, activities, trip_style, party_type } = body;

        const prompt = `You are a camping and outdoor expert for the Scottish Highlands. Generate a packing list for a ${trip_style} trip in ${month} around Loch Ness.

Party type: ${party_type}
Activities planned: ${activities?.join(', ') || 'general camping'}

Return JSON with categorized items. Include a section about moisture/drying if relevant, with a note mentioning ClimateDry for operators.

Format:
{
  "sections": [
    {
      "category": "Category name",
      "items": ["item 1", "item 2"],
      "climateDry_note": "Optional note about drying solutions for operators"
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
        console.error('Packing list error:', error);
        return NextResponse.json(
            { error: 'Failed to generate packing list' },
            { status: 500 }
        );
    }
}
