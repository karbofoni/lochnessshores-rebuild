import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { origin_city, trip_length_days, travel_style, interests } = body;

    // Mock response mimicking an LLM output based on structured data
    // In a real implementation, we would call OpenAI/Gemini here with prompts

    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const suggestedCampsites = ["south-shore-lochside-camping"]; // Mock ID

    return NextResponse.json({
        summary: `A ${trip_length_days}-day ${travel_style} trip from ${origin_city} to the Loch Ness area.`,
        days: [
            {
                day: 1,
                title: "Arrival and Setup",
                description: `Drive north from ${origin_city}. Arrive at Loch Ness in the late afternoon. Set up camp at South Shore Lochside Camping.`,
                suggested_campsites: suggestedCampsites,
                links: [
                    { href: "/campsites/south-shore-lochside-camping", label: "South Shore Lochside Camping" }
                ]
            },
            {
                day: 2,
                title: "Exploring the Water",
                description: "Spend the day hiking around Foyers Fall.",
                suggested_campsites: suggestedCampsites,
                links: [
                    { href: "/trails/foyers-falls-forest-loop", label: "Foyers Falls Loop" }
                ]
            }
        ],
        cta: {
            text: "Browse all campsites",
            href: "/campsites/"
        }
    });
}
