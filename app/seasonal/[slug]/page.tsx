import Link from "next/link";
import { getCampsites } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";
import { StayingDryBlock } from "@/components/StayingDryBlock";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { ArrowLeft, Sun, Cloud, Snowflake, Leaf } from "lucide-react";

const seasons = ['spring', 'summer', 'autumn', 'winter'];

const seasonData: Record<string, {
    title: string;
    iconName: string;
    intro: string;
    tips: string[];
    bestStayTypes: string[];
}> = {
    spring: {
        title: 'Spring Camping around Loch Ness',
        iconName: 'leaf',
        intro: 'Spring (March-May) offers longer days, emerging wildlife, and fewer midges. Expect cool temperatures and occasional showers.',
        tips: ['Pack layers for variable temperatures', 'Waterproof jacket essential', 'Great for wildlife watching'],
        bestStayTypes: ['lochside-campsite', 'campervan-pitch']
    },
    summer: {
        title: 'Summer Camping around Loch Ness',
        iconName: 'sun',
        intro: 'Summer (June-August) brings long daylight hours and the warmest weather. Be prepared for midges, especially near water at dusk.',
        tips: ['Midge repellent is essential', 'Book popular sites early', 'Best time for wild swimming'],
        bestStayTypes: ['lochside-campsite', 'glamping-pod']
    },
    autumn: {
        title: 'Autumn Camping around Loch Ness',
        iconName: 'cloud',
        intro: 'Autumn (September-November) offers stunning colours and fewer crowds. Nights get cold, and rainfall increases.',
        tips: ['Warm sleeping bag rated for near-freezing', 'Short daylight hours', 'Beautiful foliage for photography'],
        bestStayTypes: ['glamping-pod', 'campervan-pitch']
    },
    winter: {
        title: 'Winter Camping around Loch Ness',
        iconName: 'snowflake',
        intro: 'Winter (December-February) is challenging but rewarding. Many sites close, but some offer year-round stays. Snow is possible.',
        tips: ['4-season tent or heated accommodation', 'Check site opening dates', 'Dramatic scenery and solitude'],
        bestStayTypes: ['glamping-pod', 'cabin']
    }
};

function SeasonIcon({ name }: { name: string }) {
    switch (name) {
        case 'leaf': return <Leaf className="h-8 w-8 text-green-500" />;
        case 'sun': return <Sun className="h-8 w-8 text-yellow-500" />;
        case 'cloud': return <Cloud className="h-8 w-8 text-orange-500" />;
        case 'snowflake': return <Snowflake className="h-8 w-8 text-blue-400" />;
        default: return null;
    }
}

export async function generateStaticParams() {
    return seasons.map(season => ({
        slug: `${season}-camping-around-loch-ness`
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const season = slug.split('-')[0];
    const data = seasonData[season];

    if (!data) {
        return { title: "Seasonal Guide | Loch Ness" };
    }

    return {
        title: `${data.title} | Seasonal Guide`,
        description: data.intro
    };
}

export default async function SeasonalGuidePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const season = slug.split('-')[0];
    const data = seasonData[season];

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p>Season guide not found.</p>
                <Link href="/guides" className="text-brand-green">Back to guides</Link>
            </div>
        );
    }

    const allCampsites = getCampsites();
    const recommendedCampsites = allCampsites.slice(0, 4);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/guides" className="text-sm text-slate-500 hover:text-brand-green mb-6 inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to guides
                </Link>

                <div className="flex items-center gap-4 mb-6">
                    <SeasonIcon name={data.iconName} />
                    <h1 className="text-4xl font-bold text-slate-900">{data.title}</h1>
                </div>

                <p className="text-xl text-slate-600 mb-8">{data.intro}</p>

                <UnofficialDisclaimer />

                <div className="bg-slate-50 p-6 rounded-xl my-8">
                    <h2 className="text-xl font-bold mb-4">Tips for {season.charAt(0).toUpperCase() + season.slice(1)} Camping</h2>
                    <ul className="space-y-2">
                        {data.tips.map((tip, i) => (
                            <li key={i} className="flex items-start">
                                <span className="text-brand-green mr-2">•</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <h2 className="text-2xl font-bold mt-12 mb-6">Recommended Campsites for {season.charAt(0).toUpperCase() + season.slice(1)}</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {recommendedCampsites.map(site => (
                        <CampsiteCard key={site.id} campsite={site} />
                    ))}
                </div>

                <StayingDryBlock />

                <div className="mt-8 flex gap-3">
                    {seasons.filter(s => s !== season).map(s => (
                        <Link
                            key={s}
                            href={`/seasonal/${s}-camping-around-loch-ness`}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors capitalize"
                        >
                            {s}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
