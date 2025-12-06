import { notFound } from "next/navigation";
import Link from "next/link";
import { getCampsites, getAreas } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";
import { StayingDryBlock } from "@/components/StayingDryBlock";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { ArrowLeft } from "lucide-react";

// Define all possible pSEO combinations for static generation
const activities = ['hiking', 'wild-camping', 'fishing', 'cycling', 'paddling', 'relaxing'];
const audiences = ['families', 'couples', 'solo-travelers', 'groups', 'dog-owners'];
const areasList = ['south-shore', 'north-shore', 'highlands', 'loch-ness'];

export async function generateStaticParams() {
    const params: { slug: string }[] = [];

    for (const activity of activities) {
        for (const audience of audiences) {
            for (const area of areasList) {
                params.push({
                    slug: `best-${activity}-campsites-for-${audience}-in-${area}`
                });
            }
        }
    }

    return params;
}

interface PSeoParams {
    activity: string;
    audience: string;
    area: string;
}

function parsePSeoSlug(slug: string | undefined): PSeoParams | null {
    if (!slug) return null;
    const regex = /^best-(.+)-campsites-for-(.+)-in-(.+)$/;
    const match = slug.match(regex);
    if (!match) return null;
    return {
        activity: match[1],
        audience: match[2],
        area: match[3]
    };
}

function capitalize(s: string) {
    return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pseo = parsePSeoSlug(slug);
    if (pseo) {
        const title = `Best ${capitalize(pseo.activity)} Campsites for ${capitalize(pseo.audience)} in ${capitalize(pseo.area)} | Loch Ness`;
        return {
            title,
            description: `Find the perfect campsites for ${pseo.audience} who love ${pseo.activity} in ${pseo.area}, Loch Ness. Unofficial guide & recommendations.`
        };
    }
    return { title: "Guide Not Found" };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pseo = parsePSeoSlug(slug);

    if (!pseo) {
        notFound();
    }

    const { activity, audience, area } = pseo;
    const allCampsites = getCampsites();
    const allAreas = getAreas();

    // Filter campsites based on area
    const relevantCampsites = allCampsites.filter(site => {
        if (area === 'loch-ness') return true;
        return site.area_id === area;
    });

    const displayCampsites = relevantCampsites.slice(0, 6);
    const areaInfo = allAreas.find(a => a.id === area);

    const title = `Best ${capitalize(activity)} Campsites for ${capitalize(audience)} in ${capitalize(area)}`;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/guides" className="text-sm text-slate-500 hover:text-brand-green mb-6 inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to guides
                </Link>

                <h1 className="text-4xl font-bold mb-6 text-slate-900">{title}</h1>
                <p className="text-xl text-slate-600 mb-8">
                    Planning a trip to {capitalize(area)} with {capitalize(audience.replace('-', ' '))}?
                    Here are the top rated spots for {activity.replace(/-/g, ' ')} enthusiasts.
                </p>

                <UnofficialDisclaimer />

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 my-12">
                    {displayCampsites.map(site => (
                        <CampsiteCard key={site.id} campsite={site} />
                    ))}
                </div>

                {areaInfo && (
                    <div className="bg-slate-50 p-6 rounded-xl mb-8">
                        <h2 className="text-xl font-bold mb-4">Why choose {capitalize(area)}?</h2>
                        <p className="mb-4 text-slate-700">{areaInfo.description}</p>
                    </div>
                )}

                <StayingDryBlock />

                <div className="mt-8 p-6 bg-brand-green/10 rounded-xl">
                    <h3 className="font-bold text-lg mb-3">Explore More</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/campsites?area=${area}`}
                            className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            All Campsites in {capitalize(area)}
                        </Link>
                        <Link
                            href="/trails"
                            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Explore Trails
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
