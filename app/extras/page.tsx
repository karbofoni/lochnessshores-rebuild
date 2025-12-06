import { getExtras, getAreas } from "@/lib/data";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";

export const metadata = {
    title: "Activities & Services around Loch Ness | Unofficial Guide",
    description: "Find boat trips, cafes, shops, and other local services.",
};

export default function ExtrasPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const allExtras = getExtras();
    const areas = getAreas();

    const areaFilter = typeof searchParams.area === 'string' ? searchParams.area : undefined;
    const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : undefined;

    const categories = [...new Set(allExtras.map(e => e.type))];

    const filteredExtras = allExtras.filter(extra => {
        if (areaFilter && extra.area_id !== areaFilter) return false;
        if (categoryFilter && extra.type !== categoryFilter) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Activities & Services</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Discover local businesses, attractions, and services around Loch Ness.
            </p>

            <UnofficialDisclaimer />

            <div className="grid lg:grid-cols-4 gap-8 mt-8">
                {/* Filters */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                        <h3 className="font-bold mb-4">Filter</h3>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Category</h4>
                            <div className="space-y-2">
                                <Link
                                    href="/extras"
                                    className={`block px-3 py-2 rounded-lg text-sm capitalize ${!categoryFilter ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                >
                                    All Categories
                                </Link>
                                {categories.map(cat => (
                                    <Link
                                        key={cat}
                                        href={`/extras?category=${cat}`}
                                        className={`block px-3 py-2 rounded-lg text-sm capitalize ${categoryFilter === cat ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Area Filter */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Area</h4>
                            <div className="space-y-2">
                                {areas.map(area => (
                                    <Link
                                        key={area.id}
                                        href={`/extras?area=${area.id}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                                        className={`block px-3 py-2 rounded-lg text-sm ${areaFilter === area.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {area.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-3">
                    <p className="text-sm text-slate-500 mb-4">
                        Showing {filteredExtras.length} result{filteredExtras.length !== 1 ? 's' : ''}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredExtras.map(extra => (
                            <Link key={extra.id} href={`/extras/${extra.slug}`} className="block group">
                                <div className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow h-full">
                                    <span className="text-sm font-bold text-brand-green uppercase tracking-wide">{extra.type}</span>
                                    <h2 className="text-xl font-bold mt-2 group-hover:text-brand-green">{extra.name}</h2>
                                    <p className="text-slate-600 mt-2 text-sm line-clamp-2">{extra.description}</p>
                                    <div className="flex items-center text-slate-500 text-sm mt-4">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="capitalize">{extra.area_id.replace('-', ' ')}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {filteredExtras.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p>No results match your filters.</p>
                            <Link href="/extras" className="text-brand-green hover:underline">
                                Clear all filters
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
