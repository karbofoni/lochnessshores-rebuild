import { getTrails, getAreas } from "@/lib/data";
import { TrailCard } from "@/components/TrailCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import Link from "next/link";

export const metadata = {
    title: "Hiking Trails around Loch Ness | Unofficial Guide",
    description: "Discover the best trails around Loch Ness for all abilities.",
};

export default function TrailsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const allTrails = getTrails();
    const areas = getAreas();

    const areaFilter = typeof searchParams.area === 'string' ? searchParams.area : undefined;
    const difficultyFilter = typeof searchParams.difficulty === 'string' ? searchParams.difficulty : undefined;

    const filteredTrails = allTrails.filter(trail => {
        if (areaFilter && trail.area_id !== areaFilter) return false;
        if (difficultyFilter && trail.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Hiking Trails around Loch Ness</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Explore walking routes, forest paths, and mountain trails in the Loch Ness area.
            </p>

            <UnofficialDisclaimer />

            <div className="grid lg:grid-cols-4 gap-8 mt-8">
                {/* Filters */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                        <h3 className="font-bold mb-4">Filter Trails</h3>

                        {/* Area Filter */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Area</h4>
                            <div className="space-y-2">
                                <Link
                                    href="/trails"
                                    className={`block px-3 py-2 rounded-lg text-sm ${!areaFilter ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                >
                                    All Areas
                                </Link>
                                {areas.map(area => (
                                    <Link
                                        key={area.id}
                                        href={`/trails?area=${area.id}`}
                                        className={`block px-3 py-2 rounded-lg text-sm ${areaFilter === area.id ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {area.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Difficulty</h4>
                            <div className="space-y-2">
                                {['Easy', 'Moderate', 'Desperate'].map(d => (
                                    <Link
                                        key={d}
                                        href={`/trails?difficulty=${d.toLowerCase()}${areaFilter ? `&area=${areaFilter}` : ''}`}
                                        className={`block px-3 py-2 rounded-lg text-sm ${difficultyFilter?.toLowerCase() === d.toLowerCase() ? 'bg-orange-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {d}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-3">
                    <p className="text-sm text-slate-500 mb-4">
                        Showing {filteredTrails.length} trail{filteredTrails.length !== 1 ? 's' : ''}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredTrails.map(trail => (
                            <TrailCard key={trail.id} trail={trail} />
                        ))}
                    </div>
                    {filteredTrails.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p>No trails match your filters.</p>
                            <Link href="/trails" className="text-brand-green hover:underline">
                                Clear all filters
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
