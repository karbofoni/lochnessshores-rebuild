'use client';

import { useState } from 'react';
import { Sparkles, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Campsite } from '@/lib/types';

interface MatchResult {
    filters: {
        area_id: string | null;
        stay_types: string[];
        facility_tags: string[];
        price_band: string | null;
        near_loch: boolean;
    };
    ranked_campsite_ids: string[];
    explanation: string;
    top_campsites: Campsite[];
}

export function CampsiteFinder() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MatchResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/match-campsites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error('Failed to get recommendations');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const buildFilterUrl = () => {
        if (!result) return '/campsites';
        const params = new URLSearchParams();
        if (result.filters.area_id) params.set('area', result.filters.area_id);
        if (result.filters.stay_types.length > 0) params.set('type', result.filters.stay_types[0]);
        return `/campsites${params.toString() ? '?' + params.toString() : ''}`;
    };

    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8 border border-emerald-100">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-800">Find your perfect campsite</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. quiet lochside spot for 2 nights in May with a pub nearby"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-700 placeholder:text-slate-400"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Finding...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Find campsites
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-emerald-100">
                        <p className="text-slate-700">{result.explanation}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {result.top_campsites.slice(0, 3).map((campsite, index) => (
                            <Link
                                key={campsite.id}
                                href={`/campsites/${campsite.slug}`}
                                className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all"
                            >
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        Best match
                                    </div>
                                )}
                                <div className="relative h-32">
                                    <Image
                                        src={campsite.photos[0] || '/images/placeholder.jpg'}
                                        alt={campsite.display_name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                        {campsite.display_name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                                        <MapPin className="w-3 h-3" />
                                        {campsite.area_id.replace('-', ' ')}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Link
                            href={buildFilterUrl()}
                            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                        >
                            View all matching campsites →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
