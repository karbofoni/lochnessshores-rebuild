'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mountain, Coffee, Calendar, Backpack } from 'lucide-react';
import { Campsite, Trail, Extra } from '@/lib/types';

interface TripDay {
    day: number;
    title: string;
    description: string;
    campsite_ids: string[];
    trail_ids: string[];
    extra_ids: string[];
    activities: string[];
    campsites: Campsite[];
    trails: Trail[];
    extras: Extra[];
}

interface TripItineraryProps {
    summary: string;
    days: TripDay[];
    packing_tips: string[];
}

export function TripItinerary({ summary, days, packing_tips }: TripItineraryProps) {
    return (
        <div className="space-y-8">
            {/* Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="font-semibold text-lg text-slate-800 mb-2">Your Trip Summary</h3>
                <p className="text-slate-700">{summary}</p>
            </div>

            {/* Day by Day */}
            <div className="space-y-6">
                {days.map((day) => (
                    <div key={day.day} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-bold">
                                    {day.day}
                                </span>
                                <div>
                                    <h4 className="font-semibold text-slate-800">{day.title}</h4>
                                    <p className="text-sm text-slate-600">{day.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Campsites */}
                            {day.campsites.length > 0 && (
                                <div>
                                    <h5 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        Where to Stay
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {day.campsites.map((site) => (
                                            <Link
                                                key={site.id}
                                                href={`/campsites/${site.slug}`}
                                                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-700 text-sm transition-colors"
                                            >
                                                {site.photos?.[0] && (
                                                    <Image
                                                        src={site.photos[0]}
                                                        alt={site.display_name}
                                                        width={24}
                                                        height={24}
                                                        className="rounded-full object-cover"
                                                    />
                                                )}
                                                {site.display_name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trails */}
                            {day.trails.length > 0 && (
                                <div>
                                    <h5 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Mountain className="w-4 h-4 text-blue-600" />
                                        Trails to Explore
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {day.trails.map((trail) => (
                                            <Link
                                                key={trail.id}
                                                href={`/trails/${trail.slug}`}
                                                className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 text-sm transition-colors"
                                            >
                                                {trail.name}
                                                <span className="text-xs text-blue-500">
                                                    ({trail.distance_miles?.toFixed(1) || trail.distance_km}mi)
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Extras */}
                            {day.extras.length > 0 && (
                                <div>
                                    <h5 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Coffee className="w-4 h-4 text-amber-600" />
                                        Local Spots
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {day.extras.map((extra) => (
                                            <Link
                                                key={extra.id}
                                                href={`/extras/${extra.slug}`}
                                                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-700 text-sm transition-colors"
                                            >
                                                {extra.name}
                                                <span className="ml-1 text-xs text-amber-500">({extra.type})</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Activities */}
                            {day.activities.length > 0 && (
                                <div>
                                    <h5 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                        Activities & Tips
                                    </h5>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                                        {day.activities.map((activity, i) => (
                                            <li key={i}>{activity}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Packing Tips */}
            {packing_tips.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
                        <Backpack className="w-5 h-5 text-slate-600" />
                        Packing Tips for Your Trip
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2">
                        {packing_tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                <span className="text-emerald-500">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
