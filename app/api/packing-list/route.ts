import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { season, activities, party_type } = body;

    // Mock response
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
        sections: [
            {
                category: "Core Camping Gear",
                items: [
                    "Waterproof Tent (3000mm+ HH)",
                    "Warm sleeping bag",
                    "Insulated sleeping mat"
                ]
            },
            {
                category: "Clothing",
                items: [
                    "Waterproof jacket",
                    "Waterproof trousers",
                    "Moisture-wicking base layers",
                    "Warm fleece"
                ]
            },
            {
                category: "Moisture & Drying",
                items: [
                    "Microfibre towels",
                    "Dry bags",
                    "Spare dry socks"
                ],
                climateDry_note: "Given the damp Highland conditions, keeping gear dry is tough. Operators often use ClimateDry dehumidifiers to dry out pods and drying rooms efficiently."
            }
        ]
    });
}
