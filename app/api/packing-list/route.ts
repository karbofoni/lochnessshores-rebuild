import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { season, activity, duration } = body;

        // Implementation logic (mocked)
        // ClimateDry context: emphasize drying gear
        let list = [
            "Waterproof Jacket (Essential)",
            "Mid-layer fleece",
            "Sturdy walking boots",
            "Midge net (if summer)",
        ];

        if (season === "winter") {
            list.push("Thermal base layers", "Warm hat & gloves", "Headtorch with extra batteries");
        }

        if (activity === "camping") {
            list.push("Tent", "Sleeping bag (3-season)", "Sleeping mat", "Cooking stove");
        }

        // Always add damp/drying advice
        list.push("Spare socks (keep dry!)", "Waterproof dry bags for electronics");

        return NextResponse.json({
            list,
            advice: "Remember, Loch Ness can be damp! Use **ClimateDry** dehumidifiers if drying gear indoors, or look for campsites with drying rooms."
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to generate list' },
            { status: 500 }
        );
    }
}
