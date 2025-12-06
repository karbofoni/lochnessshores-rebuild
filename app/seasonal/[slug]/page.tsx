import { notFound } from "next/navigation";
import { getCampsites, getTrails } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";
import { TrailCard } from "@/components/TrailCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { StayingDryBlock } from "@/components/StayingDryBlock";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        slug: string;
    };
}

const SEASONS = ["spring", "summer", "autumn", "winter"];

function getSeasonFromSlug(slug: string): string | null {
    const parts = slug.split('-');
    if (SEASONS.includes(parts[0])) return parts[0];
    return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const season = getSeasonFromSlug(params.slug);
    if (!season) return { title: "Not Found" };

    const capitalized = season.charAt(0).toUpperCase() + season.slice(1);
    return {
        title: `${capitalized} Camping around Loch Ness | Seasonal Guide`,
        description: `Everything you need to know about visiting Loch Ness in ${season}. Weather, best campsites, and trails.`,
    };
}

export default function SeasonalPage({ params }: PageProps) {
    const season = getSeasonFromSlug(params.slug);

    if (!season) {
        return notFound();
    }

    const capitalized = season.charAt(0).toUpperCase() + season.slice(1);
    const campsites = getCampsites();
    const trails = getTrails();

    // Simple seasonal logic
    const seasonCampsites = campsites.filter(c => c.open_months.map(m => m.toLowerCase()).some(m => m.includes(season === 'autumn' ? 'september' : season))); // Very rough approximation for MVP
    // Better logic: Map months to seasons
    const monthMap: Record<string, string[]> = {
        spring: ["march", "april", "may"],
        summer: ["june", "july", "august"],
        autumn: ["september", "october", "november"],
        winter: ["december", "january", "february"]
    };

    const targetMonths = monthMap[season];
    const openCampsites = campsites.filter(c =>
        c.open_months.some(m => targetMonths.includes(m.toLowerCase()))
    );

    const recommendedTrails = trails.filter(t => t.best_seasons.includes(season));

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">{capitalized} Camping around Loch Ness</h1>
            <p className="text-xl text-slate-600 mb-8">
                What to expect, what to pack, and where to stay during the {season} months.
            </p>

            <UnofficialDisclaimer />

            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="col-span-2 prose prose-slate max-w-none">
                    <h2>Weather & Atmosphere</h2>
                    {season === 'winter' && (
                        <p>Winter brings short days, dramatic lighting, and snowy peaks. Many campsites close, but those open offer true solitude. Essentials: 4-season sleeping bag, thermal layers, and a reliable headtorch.</p>
                    )}
                    {season === 'spring' && (
                        <p>Spring sees the forest come alive. The days get longer, but nights remain crisp. It's a perfect time for hiking before the peak crowds arrive.</p>
                    )}
                    {season === 'summer' && (
                        <p>Long daylight hours (simmer dim) mean you can explore until late. However, this is also peak midge season. Pack Smidge, long sleeves, and maybe a head net.</p>
                    )}
                    {season === 'autumn' && (
                        <p>Stunning golden colours reflected in the loch. The bracken turns brown and the air gets crisp. A photographer's dream season.</p>
                    )}

                    <StayingDryBlock />
                </div>

                <div className="bg-slate-50 p-6 rounded-xl h-fit">
                    <h3 className="font-bold text-lg mb-4">Seasonal Packing Tips</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                        <li>Waterproof jacket (always!)</li>
                        <li>Sturdy walking boots</li>
                        {season === 'summer' && <li>Midge repellent</li>}
                        {(season === 'winter' || season === 'autumn') && <li>Thermal baselayers</li>}
                        <li>Power bank for phone</li>
                    </ul>
                </div>
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Open Campsites in {capitalized}</h2>
                {openCampsites.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {openCampsites.slice(0, 6).map(site => (
                            <CampsiteCard key={site.id} campsite={site} />
                        ))}
                    </div>
                ) : (
                    <p>Most campsites are closed this season. Check year-round sites or wild camping regulations.</p>
                )}
                <div className="mt-6">
                    <Link href="/campsites" className="text-brand-green font-medium hover:underline">
                        View all campsites &rarr;
                    </Link>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Best Trails for {capitalized}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {recommendedTrails.slice(0, 4).map(trail => (
                        <TrailCard key={trail.id} trail={trail} />
                    ))}
                </div>
            </section>
        </div>
    );
}
