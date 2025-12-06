import { notFound } from "next/navigation";
import Link from "next/link";
// Map is now a client component that handles its own dynamic loading
import Map from "@/components/Map";
import { getCampsiteBySlug, getTrails, getCampsites } from "@/lib/data";
import { StayingDryBlock } from "@/components/StayingDryBlock";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { MapPin, Check, ExternalLink, Phone, Mail, Home } from "lucide-react";
import { FacilityIcon } from "@/components/FacilityIcon";

export async function generateStaticParams() {
    const campsites = getCampsites();
    return campsites.map((campsite) => ({
        slug: campsite.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const campsite = getCampsiteBySlug(slug);
    if (!campsite) return { title: "Campsite Not Found" };

    return {
        title: `${campsite.display_name} | Loch Ness Camping`,
        description: campsite.short_description,
    };
}

export default async function CampsiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const campsite = getCampsiteBySlug(slug);

    if (!campsite) {
        notFound();
    }

    const allTrails = getTrails();
    const nearbyTrails = allTrails.filter(t => t.area_id === campsite.area_id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <Link href="/campsites" className="text-sm text-slate-500 hover:text-brand-green mb-4 inline-block">
                    &larr; Back to all campsites
                </Link>

                {/* Header Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <span className="bg-brand-green/10 text-brand-green text-sm font-bold px-3 py-1 rounded-full mb-3 inline-block capitalize">
                            {campsite.area_id.replace('-', ' ')}
                        </span>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">{campsite.display_name}</h1>

                        <div className="space-y-2 text-slate-600 mb-6">
                            {campsite.address && (
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-slate-400 shrink-0" />
                                    <span>{campsite.address}</span>
                                </div>
                            )}
                            {campsite.phone && (
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 mr-2 text-slate-400 shrink-0" />
                                    <a href={`tel:${campsite.phone}`} className="hover:text-brand-green">{campsite.phone}</a>
                                </div>
                            )}
                            {campsite.email && (
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-2 text-slate-400 shrink-0" />
                                    <a href={`mailto:${campsite.email}`} className="hover:text-brand-green">{campsite.email}</a>
                                </div>
                            )}
                        </div>

                        <p className="text-lg text-slate-700 leading-relaxed">
                            {campsite.short_description}
                        </p>
                    </div>

                    <div className="h-full min-h-[300px] rounded-xl overflow-hidden shadow-sm border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {campsite.photos[0] ? (
                            <img
                                src={campsite.photos[0]}
                                alt={campsite.display_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                <span className="text-slate-400 font-medium">No Image Available</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Facilities Grid */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <Home className="h-5 w-5 mr-2 text-brand-green" />
                                Facilities & Features
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {campsite.facility_tags.map(tag => (
                                    <div key={tag} className="flex items-center p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-brand-green/20 transition-colors">
                                        <FacilityIcon tag={tag} className="h-5 w-5 mr-2 text-brand-green" />
                                        <span className="text-sm font-medium text-slate-700 capitalize">{tag.replace(/[_-]/g, ' ')}</span>
                                    </div>
                                ))}
                                {campsite.stay_types.map(tag => (
                                    <div key={tag} className="flex items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
                                        <FacilityIcon tag={tag} className="h-5 w-5 mr-2 text-blue-500" />
                                        <span className="text-sm font-medium text-blue-900 capitalize">{tag.replace(/[_-]/g, ' ')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 h-[400px]">
                            <Map campsite={campsite} />
                        </div>

                        {campsite.has_drying_room && (
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-2">Drying Facilities Available</h3>
                                <p className="text-blue-800">{campsite.damp_notes}</p>
                            </div>
                        )}

                        <StayingDryBlock />
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
                            <h3 className="font-bold text-slate-900 mb-4">Plan Your Stay</h3>
                            <div className="space-y-4 text-sm text-slate-700 mb-6">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Price Band</span>
                                    <span className="font-medium capitalize">{campsite.typical_price_band}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Min Stay</span>
                                    <span className="font-medium">{campsite.min_night_stay} Night(s)</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 mb-1">Open Months</span>
                                    <div className="flex flex-wrap gap-1">
                                        {/* Abbreviated months or range could be better, but list is fine for now */}
                                        {campsite.open_months.length === 12 ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Year Round</span>
                                        ) : (
                                            <span className="text-slate-900">{campsite.open_months[0]} - {campsite.open_months[campsite.open_months.length - 1]}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <a
                                href={campsite.external_booking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-brand-green text-white text-center font-bold py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center shadow-lg shadow-brand-green/20"
                            >
                                Book Now / Visit Website
                                <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                        </div>

                        {nearbyTrails.length > 0 && (
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold mb-4">Nearby Trails</h3>
                                <div className="space-y-3">
                                    {nearbyTrails.slice(0, 3).map(trail => (
                                        <Link key={trail.id} href={`/trails/${trail.slug}`} className="block group">
                                            <div className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow">
                                                <h4 className="font-bold text-sm group-hover:text-brand-green">{trail.name}</h4>
                                                <p className="text-xs text-slate-500">{trail.distance_km}km &bull; {trail.difficulty}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12">
                    <UnofficialDisclaimer />
                </div>
            </div>
        </div>
    );
}
