import { getTrails, getAreas } from "@/lib/data";
import { TrailCard } from "@/components/TrailCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import Link from "next/link";
import { FilterControls } from "@/components/FilterControls"; // We might need a separate TrailFilterControls or genericize it

export const metadata = {
    title: "Hiking, Cycling & Paddling Trails | Loch Ness Guide",
    description: "Discover the best trails around Loch Ness for all abilities.",
};

export const dynamic = 'force-dynamic';

export default function TrailsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const allTrails = getTrails();
    // Filter Logic Implementation (Simplified inline for now as FilterControls is currently geared towards campsites primarily, 
    // but we can reuse it if we pass generic props, or just filter by Area for now). 
    // Re-using FilterControls would require adapting it to accept "Difficulties" and "Types" instead of "StayTypes". 
    // For MVP speed, I will stick to simple Area filtering here or basic list.

    // Let's implement basic filtering here similar to Campsites
    const filteredTrails = allTrails.filter((trail) => {
        const areaFilter = searchParams.area as string;
        if (areaFilter && !areaFilter.split(',').includes(trail.area_id)) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Trails around Loch Ness</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                From gentle forest walks to challenging hill climbs. Explore the paths less travelled.
            </p>

            <UnofficialDisclaimer />

            <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                        <h3 className="font-semibold mb-3">Filter by Area</h3>
                        <div className="space-y-2">
                            {getAreas().map(area => (
                                <Link
                                    key={area.id}
                                    href={`/trails?area=${area.id}`}
                                    className="block text-sm text-slate-700 hover:text-brand-green"
                                >
                                    {area.name}
                                </Link>
                            ))}
                            <Link href="/trails" className="block text-sm text-slate-500 underline mt-4">Clear Filters</Link>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredTrails.map((trail) => (
                            <TrailCard key={trail.id} trail={trail} />
                        ))}
                    </div>
                    {filteredTrails.length === 0 && (
                        <p>No trails found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
