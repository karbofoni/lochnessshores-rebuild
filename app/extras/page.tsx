import Link from "next/link";

export const dynamic = 'force-dynamic';
import { getExtras, getAreas } from "@/lib/data";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { Coffee, Anchor, ShoppingBag, Info, Binoculars } from "lucide-react";

export const metadata = {
    title: "Activities & Services around Loch Ness",
    description: "Find boat trips, cafes, shops, and other local services.",
};

export default function ExtrasPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const allExtras = getExtras();
    const areaFilter = searchParams.area as string;
    const categoryFilter = searchParams.category as string;

    const filteredExtras = allExtras.filter((extra) => {
        if (areaFilter && extra.area_id !== areaFilter) return false;
        if (categoryFilter && extra.category !== categoryFilter) return false;
        return true;
    });

    const getIcon = (category: string) => {
        switch (category) {
            case "activity": return <Binoculars className="h-5 w-5" />;
            case "food-drink": return <Coffee className="h-5 w-5" />;
            case "shop": return <ShoppingBag className="h-5 w-5" />;
            case "rental": return <Anchor className="h-5 w-5" />;
            default: return <Info className="h-5 w-5" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Explore Extras</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Boat tours, cozy cafes, gear shops, and more.
            </p>

            <UnofficialDisclaimer />

            <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/extras" className="px-4 py-2 bg-slate-100 rounded-full hover:bg-slate-200 text-sm font-medium">All Areas</Link>
                {getAreas().map(area => (
                    <Link
                        key={area.id}
                        href={`/extras?area=${area.id}`}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${areaFilter === area.id ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                    >
                        {area.name}
                    </Link>
                ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExtras.map((extra) => (
                    <div key={extra.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                                {getIcon(extra.category)}
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{extra.category}</span>
                        </div>

                        <h3 className="text-xl font-bold mb-2">
                            {/* Simplified: No detail page for extras in MVP if not strictly necessary, but PRD says /extras/[slug]/ exists. */}
                            <Link href={`/extras/${extra.slug}`} className="hover:text-brand-green hover:underline">
                                {extra.name}
                            </Link>
                        </h3>
                        <p className="text-slate-600 text-sm mb-4">
                            {extra.summary}
                        </p>
                        <div className="flex items-center text-xs text-slate-500">
                            <span className="bg-slate-50 px-2 py-1 rounded">
                                {extra.area_id.replace('-', ' ')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredExtras.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-lg">
                    <p className="text-slate-500">No extras found for this filter.</p>
                </div>
            )}
        </div>
    );
}
