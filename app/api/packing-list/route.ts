import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { season, activity, duration } = body;

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
        }

        const prompt = `Generate a packing list for a trip to Loch Ness, Scotland.
    Context:
    - Season: ${season || 'Summer'}
    - Activity: ${activity || 'Camping'}
    - Duration: ${duration || '3 days'}
    
    Output JSON format only:
    {
        "list": ["item 1", "item 2"],
        "advice": "Short advice specific to Loch Ness conditions (midges/rain)."
    }`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful outdoor guide." },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            max_tokens: 300,
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        return NextResponse.json(result);
    } catch (error) {
        console.error("OpenAI Error:", error);
        return NextResponse.json(
            { error: 'Failed to generate list' },
            { status: 500 }
        );
    }
}
