import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message } = body;

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert travel guide for Loch Ness, Scotland. Create a structured 3-day itinerary based on the user's request. Include suggested campsites from the local area (South Shore, North Shore, Foyers, Dores). Format the output with Markdown: use ## for Days and - for bullet points. suggestive and independent."
                },
                {
                    role: "user",
                    content: message || "Plan a 3-day trip to Loch Ness for a family."
                },
            ],
            max_tokens: 500,
        });

        return NextResponse.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI Error:", error);
        return NextResponse.json(
            { error: 'Failed to generate itinerary. Please try again.' },
            { status: 500 }
        );
    }
}
