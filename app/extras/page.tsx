import { getExtras } from "@/lib/data";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";

export const metadata = {
    title: "Activities & Services around Loch Ness | Unofficial Guide",
    description: "Find boat trips, cafes, shops, and other local services.",
};

export default function ExtrasPage() {
    const allExtras = getExtras();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Activities & Services</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Discover local businesses, attractions, and services around Loch Ness.
            </p>

            <UnofficialDisclaimer />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {allExtras.map((extra) => (
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
        </div>
    );
}
