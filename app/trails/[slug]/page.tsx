import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrailBySlug, getCampsites, getTrails } from "@/lib/data";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { CampsiteCard } from "@/components/CampsiteCard";
import { MapPin, Activity, Mountain, ArrowLeft } from "lucide-react";
import TrailMapWrapper from "@/components/TrailMapWrapper";
import { calculateHaversineDistance } from "@/lib/utils";

export async function generateStaticParams() {
    const trails = getTrails();
    return trails.map((trail) => ({
        slug: trail.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const trail = getTrailBySlug(slug);
    if (!trail) return { title: "Trail Not Found" };

    return {
        title: `${trail.name} | Loch Ness Trails`,
        description: trail.summary,
    };
}

export default async function TrailDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const trail = getTrailBySlug(slug);

    if (!trail) {
        notFound();
    }

    // Filter nearby campsites by real distance (within 10 miles)
    const allCampsites = getCampsites();
    const nearbyCampsites = allCampsites
        .map(site => {
            const distance = calculateHaversineDistance(
                trail.latitude,
                trail.longitude,
                site.latitude,
                site.longitude
            );
            return { ...site, distanceMiles: distance };
        })
        .filter(site => site.distanceMiles <= 10)
        .sort((a, b) => a.distanceMiles - b.distanceMiles);


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link href="/trails" className="text-sm text-slate-500 hover:text-brand-green mb-4 inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to trails
                </Link>

                {/* Header Section */}
                <div className="mb-8">
                    <span className="bg-slate-100 text-slate-700 text-sm font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wide">
                        {trail.type}
                    </span>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{trail.name}</h1>
                    <div className="flex flex-wrap gap-4 text-slate-600 text-sm font-medium">
                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {trail.area_id}</span>
                        <span className="flex items-center"><Activity className="h-4 w-4 mr-1" /> {trail.distance_miles} miles</span>
                        <span className="flex items-center"><Mountain className="h-4 w-4 mr-1" /> {trail.difficulty}</span>
                    </div>
                </div>

                {/* Map Section */}
                <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100 mb-8 relative">
                    <TrailMapWrapper
                        startLat={trail.latitude}
                        startLng={trail.longitude}
                        geometry={trail.geometry || []}
                        name={trail.name}
                    />
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 mb-8">
                    <h2 className="text-xl font-bold mb-4">Route Description</h2>
                    <p className="text-slate-700 leading-relaxed mb-6">
                        {trail.summary}
                    </p>

                    <div className="bg-slate-50 p-6 rounded-lg mb-6">
                        <h3 className="font-semibold mb-3">Highlights</h3>
                        <div className="flex flex-wrap gap-2">
                            {trail.highlights.map(h => (
                                <span key={h} className="bg-white border rounded-full px-3 py-1 text-sm text-slate-700">
                                    {h}
                                </span>
                            ))}
                        </div>
                    </div>

                    {trail.notes && trail.notes !== 'Data sourced from OpenStreetMap' && (
                        <div className="bg-amber-50 p-4 rounded border-l-4 border-amber-400 mb-6">
                            <h4 className="font-bold text-amber-900 mb-1">Notes from the Trail</h4>
                            <p className="text-sm text-amber-800">{trail.notes}</p>
                        </div>
                    )}
                </div>

                {/* Nearby Campsites Section */}
                {nearbyCampsites.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Where to stay nearby <span className="text-base font-normal text-slate-500">(within 10 miles)</span></h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {nearbyCampsites.map(site => (
                                <div key={site.id} className="relative">
                                    <CampsiteCard campsite={site} />
                                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-600 shadow-sm border border-slate-200">
                                        {site.distanceMiles.toFixed(1)} miles away
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <UnofficialDisclaimer />
            </div>
        </div>
    );
}
