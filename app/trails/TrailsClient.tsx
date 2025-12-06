"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TrailCard } from "@/components/TrailCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import type { Trail, Area } from "@/lib/types";

// Import data directly for client-side use
import trailsData from "@/data/trails.json";
import areasData from "@/data/areas.json";

export default function TrailsClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const allTrails = trailsData as Trail[];
    const areas = areasData as Area[];

    const [areaFilter, setAreaFilter] = useState<string | null>(null);
    const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

    // Sync URL params to state on mount
    useEffect(() => {
        setAreaFilter(searchParams.get('area'));
        setDifficultyFilter(searchParams.get('difficulty'));
    }, [searchParams]);

    // Update URL when filters change
    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/trails?${params.toString()}`);
    };

    const filteredTrails = allTrails.filter(trail => {
        if (areaFilter && trail.area_id !== areaFilter) return false;
        if (difficultyFilter && trail.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Hiking Trails around Loch Ness</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Explore walking routes, forest paths, and mountain trails in the Loch Ness area.
            </p>

            <UnofficialDisclaimer />

            <div className="grid lg:grid-cols-4 gap-8 mt-8">
                {/* Filters */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Filter Trails</h3>
                            {(areaFilter || difficultyFilter) && (
                                <button
                                    onClick={() => router.push('/trails')}
                                    className="text-xs text-slate-500 hover:text-red-500"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Area Filter */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Area</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => updateFilter('area', null)}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${!areaFilter ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                >
                                    All Areas
                                </button>
                                {areas.map(area => (
                                    <button
                                        key={area.id}
                                        onClick={() => updateFilter('area', area.id)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${areaFilter === area.id ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {area.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Difficulty</h4>
                            <div className="space-y-2">
                                {['easy', 'moderate', 'hard'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => updateFilter('difficulty', difficultyFilter === d ? null : d)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm capitalize ${difficultyFilter === d ? 'bg-orange-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-3">
                    <p className="text-sm text-slate-500 mb-4">
                        Showing {filteredTrails.length} trail{filteredTrails.length !== 1 ? 's' : ''}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredTrails.map(trail => (
                            <TrailCard key={trail.id} trail={trail} />
                        ))}
                    </div>
                    {filteredTrails.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p>No trails match your filters.</p>
                            <button
                                onClick={() => router.push('/trails')}
                                className="text-brand-green hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
