import { notFound } from "next/navigation";
import Link from "next/link";
import { getGuideData } from "@/lib/posts";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { ArrowLeft } from "lucide-react";
import { StayingDryBlock } from "@/components/StayingDryBlock";
import { getCampsites } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";

export const dynamic = 'force-dynamic';

interface PSeoParams {
    activity: string;
    audience: string;
    area: string;
}

function parsePSeoSlug(slug: string): PSeoParams | null {
    // Pattern: best-[activity]-campsites-for-[audience]-in-[area]
    const regex = /^best-(.+)-campsites-for-(.+)-in-(.+)$/;
    const match = slug.match(regex);
    if (!match) return null;
    return {
        activity: match[1], // e.g. "hiking"
        audience: match[2], // e.g. "families"
        area: match[3]      // e.g. "south-shore"
    };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const pseo = parsePSeoSlug(params.slug);
    if (pseo) {
        const title = `Best ${capitalize(pseo.activity)} Campsites for ${capitalize(pseo.audience)} in ${capitalize(pseo.area)} | Loch Ness`;
        return {
            title,
            description: `Find the perfect campsites for ${pseo.audience} who love ${pseo.activity} in ${pseo.area}, Loch Ness. Unofficial guide & recommendations.`
        };
    }

    const guide = await getGuideData(params.slug);
    if (!guide) return { title: "Guide Not Found" };

    return {
        title: `${guide.title} | Loch Ness Guides`,
        description: guide.excerpt,
    };
}

function capitalize(s: string) {
    return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
    const pseo = parsePSeoSlug(params.slug);

    // 1. Handle pSEO Dynamic Route
    if (pseo) {
        const { activity, audience, area } = pseo;
        const allCampsites = getCampsites();

        // Filter logic (Enhanced with "real" data checks if available)
        // For MVP/Demo: Filter by area ID and basic text match in description/tags
        const relevantCampsites = allCampsites.filter(site => {
            const matchesArea = site.area_id === area || area === 'loch-ness';
            // Simple keyword matching for demo since we don't have strict 'activity' tags yet
            const text = (site.short_description + site.stay_types.join(' ') + site.facility_tags.join(' ')).toLowerCase();
            const matchesActivity = text.includes(activity.replace(/-/g, ' ')) || true; // Broad match for demo

            // Audience mapping
            let matchesAudience = true;
            if (audience === 'families') matchesAudience = !!site.facility_tags.find(t => t.includes('family') || t.includes('play'));
            if (audience === 'couples') matchesAudience = !!site.stay_types.find(t => t.includes('pod') || t === 'glamping');

            return matchesArea && matchesActivity && matchesAudience;
        });

        // Fallback if strict filter yields none (to ensure page isn't empty)
        const displayCampsites = relevantCampsites.length > 0 ? relevantCampsites : allCampsites.slice(0, 3);

        const title = `Best ${capitalize(activity)} Campsites for ${capitalize(audience)} in ${capitalize(area)}`;

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/guides" className="text-sm text-slate-500 hover:text-brand-green mb-6 inline-flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to guides
                    </Link>

                    <h1 className="text-4xl font-bold mb-6 text-slate-900">{title}</h1>
                    <p className="text-xl text-slate-600 mb-8">
                        Planning a trip to {capitalize(area)} with {capitalize(audience)}?
                        Here are the top rated spots for {activity.replace(/-/g, ' ')} enthusiasts.
                    </p>

                    <UnofficialDisclaimer />

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
                        {displayCampsites.map(site => (
                            <CampsiteCard key={site.id} campsite={site} />
                        ))}
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl mb-8">
                        <h2 className="text-xl font-bold mb-4">Why choose {capitalize(area)}?</h2>
                        <p className="mb-4 text-slate-700">
                            {capitalize(area)} offers some of the most spectacular scenery around Loch Ness.
                            Whether you're looking for wild solitude or family-friendly parks, this area has it all.
                        </p>
                        <StayingDryBlock />
                    </div>
                </div>
            </div>
        );
    }

    // 2. Handle Static Markdown Guide
    const guide = await getGuideData(params.slug);
    if (!guide) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/guides" className="text-sm text-slate-500 hover:text-brand-green mb-6 inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to guides
                </Link>

                <h1 className="text-4xl font-bold mb-4 text-slate-900 leading-tight">{guide.title}</h1>
                <p className="text-xl text-slate-600 mb-8 font-light">
                    {guide.excerpt}
                </p>

                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm mb-8">
                    <div
                        className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-brand-green"
                        dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
                    />
                </div>

                <StayingDryBlock />
                <UnofficialDisclaimer />
            </div>
        </div>
    );
}
