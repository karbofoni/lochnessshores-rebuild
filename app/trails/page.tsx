import { getTrails } from "@/lib/data";
import { TrailCard } from "@/components/TrailCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";

export const metadata = {
    title: "Hiking Trails around Loch Ness | Unofficial Guide",
    description: "Discover the best trails around Loch Ness for all abilities.",
};

export default function TrailsPage() {
    const allTrails = getTrails();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Hiking Trails around Loch Ness</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Explore walking routes, forest paths, and mountain trails in the Loch Ness area.
            </p>

            <UnofficialDisclaimer />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {allTrails.map((trail) => (
                    <TrailCard key={trail.id} trail={trail} />
                ))}
            </div>
        </div>
    );
}
