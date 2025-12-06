import { notFound } from "next/navigation";
import { getCampsites, getTrails, getExtras, getTrailBySlug } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { getDistanceKm } from "@/lib/distance";
import { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        type: string;
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { type, slug } = params;
    let name = slug.replace(/-/g, ' '); // Fallback

    if (type === 'trail') {
        const trail = getTrailBySlug(slug);
        if (trail) name = trail.name;
    } else if (type === 'attraction') {
        // Mock lookup for attraction if meaningful, else formatted slug
        const extras = getExtras();
        const extra = extras.find(e => e.slug === slug);
        if (extra) name = extra.name;
    }

    return {
        title: `Campsites near ${name} | Loch Ness`,
        description: `Find the closest campsites and places to stay near ${name} around Loch Ness.`,
    };
}

export default function NearbyPage({ params }: PageProps) {
    const { type, slug } = params;

    // 1. Identify valid entity
    let targetEntity: { name: string; lat: number; lng: number } | null = null;
    let entityTypeLabel = type;

    if (type === 'trail') {
        const trail = getTrailBySlug(slug);
        if (trail) {
            targetEntity = { name: trail.name, lat: trail.start_lat, lng: trail.start_lng };
            entityTypeLabel = "Trail";
        }
    } else if (type === 'attraction' || type === 'activity') {
        const extras = getExtras();
        const extra = extras.find(e => e.slug === slug);
        if (extra && extra.latitude && extra.longitude) {
            targetEntity = { name: extra.name, lat: extra.latitude, lng: extra.longitude };
            entityTypeLabel = extra.category === 'attraction' ? 'Attraction' : 'Activity';
        }
    }

    if (!targetEntity) {
        return notFound();
    }

    // 2. Find nearby campsites
    const allCampsites = getCampsites();
    const campsitesWithDistance = allCampsites.map(site => {
        const dist = getDistanceKm(targetEntity!.lat, targetEntity!.lng, site.latitude, site.longitude);
        return { ...site, distanceKm: dist };
    });

    const nearbyCampsites = campsitesWithDistance
        .filter(site => site.distanceKm < 20) // 20km radius
        .sort((a, b) => a.distanceKm - b.distanceKm);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <Link href={`/${type}s`} className="text-sm text-slate-500 hover:text-brand-green">
                    &larr; Back to {type}s
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-2">Campsites near {targetEntity.name}</h1>
            <div className="flex items-center text-slate-600 mb-8">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{entityTypeLabel} Location</span>
            </div>

            <UnofficialDisclaimer />

            <div className="mb-8">
                <p className="max-w-3xl text-lg text-slate-700">
                    Planning a trip to <strong>{targetEntity.name}</strong>?
                    Here are the closest campsites, glamping pods, and campervan pitches within 20km.
                </p>
            </div>

            {nearbyCampsites.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nearbyCampsites.map(site => (
                        <div key={site.id} className="relative">
                            <div className="absolute -top-3 right-3 z-10 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                {site.distanceKm} km away
                            </div>
                            <CampsiteCard campsite={site} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 p-8 rounded-lg text-center">
                    <p>No campsites found within 20km of this location.</p>
                    <Link href="/campsites" className="text-brand-green font-medium mt-2 inline-block">
                        Browse all Loch Ness campsites
                    </Link>
                </div>
            )}
        </div>
    );
}
