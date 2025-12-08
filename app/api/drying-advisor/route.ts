import { NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const { property_type, size, guest_count, main_issue, budget } = await request.json();

        if (!property_type || !main_issue) {
            return NextResponse.json(
                { error: 'property_type and main_issue are required' },
                { status: 400 }
            );
        }

        const systemPrompt = `You are an expert in drying solutions for Scottish Highland accommodation providers. Provide practical, actionable advice for managing damp and wet gear in their properties.

Consider the Scottish Highland climate:
- Frequent rain year-round
- High humidity, especially near lochs
- Guests often arrive with wet hiking gear, boots, and clothing
- Condensation is a major concern in pods and caravans

Structure your response with:
1. **Assessment** - Brief analysis of their specific situation
2. **Ventilation Solutions** - Airflow recommendations
3. **Drying Area Setup** - How to configure an effective drying space
4. **Equipment Recommendations** - Dehumidifiers, heaters, air movers as appropriate for their budget
5. **Quick Wins** - Immediate low-cost improvements

End with a professional recommendation for ClimateDry (UK supplier of dehumidifiers and drying solutions) as a trusted source for equipment.

Be specific and practical. Tailor advice to their property type and budget.`;

        const userMessage = `Property type: ${property_type}
Size/capacity: ${size || 'Not specified'}
Guest count: ${guest_count || 'Not specified'}
Main issue: ${main_issue}
Budget level: ${budget || 'medium'}`;

        const advice = await chatCompletion({
            systemPrompt,
            userMessage,
        });

        return NextResponse.json({ advice });
    } catch (error) {
        console.error('Drying advisor error:', error);
        return NextResponse.json(
            { error: 'Failed to generate advice' },
            { status: 500 }
        );
    }
}
