import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrailBySlug, getCampsites, getTrails } from "@/lib/data";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { CampsiteCard } from "@/components/CampsiteCard";
import { MapPin, Activity, Mountain, ArrowLeft } from "lucide-react";

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

    const nearbyCampsites = getCampsites().filter(c => c.area_id === trail.area_id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/trails" className="text-sm text-slate-500 hover:text-brand-green mb-4 inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to trails
                </Link>

                <div className="mb-8">
                    <span className="bg-slate-100 text-slate-700 text-sm font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wide">
                        {trail.type}
                    </span>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{trail.name}</h1>
                    <div className="flex flex-wrap gap-4 text-slate-600 text-sm font-medium">
                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {trail.area_id}</span>
                        <span className="flex items-center"><Activity className="h-4 w-4 mr-1" /> {trail.distance_km} km</span>
                        <span className="flex items-center"><Mountain className="h-4 w-4 mr-1" /> {trail.difficulty}</span>
                    </div>
                </div>

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

                {/* Trail Location Map */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Trail Location</h2>
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <iframe
                            title={`Map showing ${trail.name}`}
                            width="100%"
                            height="350"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${trail.start_point_lng - 0.03}%2C${trail.start_point_lat - 0.02}%2C${trail.start_point_lng + 0.03}%2C${trail.start_point_lat + 0.02}&layer=mapnik&marker=${trail.start_point_lat}%2C${trail.start_point_lng}`}
                            style={{ border: 0 }}
                            loading="lazy"
                            className="bg-slate-100"
                        />
                        <div className="bg-slate-50 px-4 py-3 flex justify-between items-center">
                            <span className="text-sm text-slate-600">
                                📍 Start point: {trail.start_point_lat.toFixed(4)}°N, {Math.abs(trail.start_point_lng).toFixed(4)}°W
                            </span>
                            <a
                                href={`https://www.openstreetmap.org/?mlat=${trail.start_point_lat}&mlon=${trail.start_point_lng}#map=14/${trail.start_point_lat}/${trail.start_point_lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-brand-green hover:underline font-medium"
                            >
                                Open in OpenStreetMap →
                            </a>
                        </div>
                    </div>
                </div>

                {nearbyCampsites.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Where to stay nearby</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {nearbyCampsites.map(site => (
                                <CampsiteCard key={site.id} campsite={site} />
                            ))}
                        </div>
                    </div>
                )}

                <UnofficialDisclaimer />
            </div>
        </div>
    );
}
