import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message } = body;

        // Mock response for MVP - mimicking an LLM travel planner
        // In a real implementation, this would call OpenAI/Anthropic
        const mockResponse = `Based on your request "${message}", here is a suggested itinerary:

**Day 1: Arrival & South Loch Ness**
- Arrive at Inverness.
- Drive down the B852 (South Loch Ness side).
- Stop at Dores Inn for lunch.
- Suggested Camp: **South Shore Lochside Camping** (Great views!).

**Day 2: Falls & Forest**
- Visit **Foyers Falls** (short walk).
- Hike the **Foyers Falls Forest Loop**.
- Dinner at Foyers Stores and Waterfall Cafe.

**Day 3: Return**
- Drive back via the Great Glen Way stopping at Invermoriston.

*Note: This is an AI-generated suggestion. Please check local opening times.*`;

        return NextResponse.json({ reply: mockResponse });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
