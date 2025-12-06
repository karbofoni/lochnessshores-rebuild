import { notFound } from "next/navigation";
import Link from "next/link";
import { getCampsiteBySlug, getTrails, getExtras, getCampsites } from "@/lib/data";
import { StayingDryBlock } from "@/components/StayingDryBlock";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { MapPin, Check, Tent, ExternalLink } from "lucide-react";



export async function generateMetadata({ params }: { params: { slug: string } }) {
    const campsite = getCampsiteBySlug(params.slug);
    if (!campsite) return { title: "Campsite Not Found" };

    return {
        title: `${campsite.display_name} | Loch Ness Camping`,
        description: campsite.short_description,
    };
}

export default function CampsiteDetailPage({ params }: { params: { slug: string } }) {
    const campsite = getCampsiteBySlug(params.slug);

    if (!campsite) {
        notFound();
    }

    const allTrails = getTrails();
    const nearbyTrails = allTrails.filter(t => t.area_id === campsite.area_id); // Simple proximity by area

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/campsites" className="text-sm text-slate-500 hover:text-brand-green mb-4 inline-block">
                    &larr; Back to all campsites
                </Link>

                <div className="mb-8">
                    <span className="bg-brand-green/10 text-brand-green text-sm font-bold px-3 py-1 rounded-full mb-3 inline-block">
                        {campsite.area_id.replace('-', ' ')}
                    </span>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{campsite.display_name}</h1>
                    <div className="flex items-center text-slate-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Lat: {campsite.latitude}, Lng: {campsite.longitude}</span>
                        {campsite.distance_to_loch_m && (
                            <span className="ml-4 flex items-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                                {campsite.distance_to_loch_m}m from Loch
                            </span>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                    <div className="aspect-video bg-slate-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {campsite.photos[0] && (
                            <img
                                src={campsite.photos[0]}
                                alt={campsite.display_name}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <h2 className="text-xl font-bold mb-4">Overview</h2>
                                <p className="text-slate-700 leading-relaxed mb-6">
                                    {campsite.short_description}
                                </p>

                                {campsite.has_drying_room && (
                                    <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                                        <h3 className="font-semibold text-blue-900 mb-1">Drying Facilities Available</h3>
                                        <p className="text-sm text-blue-800">{campsite.damp_notes}</p>
                                    </div>
                                )}

                                <h3 className="text-lg font-bold mb-3">Facilities & Features</h3>
                                <ul className="grid grid-cols-2 gap-2 mb-8">
                                    {campsite.facility_tags.map(tag => (
                                        <li key={tag} className="flex items-center text-slate-700 bg-slate-50 px-3 py-2 rounded">
                                            <Check className="h-4 w-4 text-green-500 mr-2" />
                                            <span className="capitalize">{tag.replace('-', ' ')}</span>
                                        </li>
                                    ))}
                                </ul>

                                <StayingDryBlock />
                            </div>

                            <div className="md:col-span-1">
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 sticky top-24">
                                    <h3 className="font-bold text-slate-900 mb-4">Need to Know</h3>
                                    <div className="space-y-4 text-sm text-slate-700 mb-6">
                                        <div>
                                            <span className="font-semibold block text-slate-900">Open Season</span>
                                            {campsite.open_months.join(', ')}
                                        </div>
                                        <div>
                                            <span className="font-semibold block text-slate-900">Stay Types</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {campsite.stay_types.map(t => (
                                                    <span key={t} className="bg-white border px-2 py-0.5 rounded text-xs">
                                                        {t.replace('-', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={campsite.external_booking_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-brand-green text-white text-center font-bold py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                                    >
                                        View Official Website
                                        <ExternalLink className="h-4 w-4 ml-2" />
                                    </a>
                                    <p className="text-xs text-slate-500 text-center mt-3">
                                        Links to external operator site
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {nearbyTrails.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Nearby Trails</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {nearbyTrails.map(trail => (
                                <Link key={trail.id} href={`/trails/${trail.slug}`} className="block group">
                                    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="font-bold group-hover:text-brand-green">{trail.name}</h3>
                                        <p className="text-sm text-slate-600">{trail.distance_km}km &bull; {trail.difficulty}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <UnofficialDisclaimer />
            </div>
        </div>
    );
}
