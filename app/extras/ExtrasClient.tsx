"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Extra, Area } from "@/lib/types";

// Import data directly for client-side use
import extrasData from "@/data/extras.json";
import areasData from "@/data/areas.json";

export default function ExtrasClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const allExtras = extrasData as Extra[];
    const areas = areasData as Area[];

    const [areaFilter, setAreaFilter] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    const categories = [...new Set(allExtras.map(e => e.type))];

    // Sync URL params to state on mount
    useEffect(() => {
        setAreaFilter(searchParams.get('area'));
        setCategoryFilter(searchParams.get('category'));
    }, [searchParams]);

    // Update URL when filters change
    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/extras?${params.toString()}`);
    };

    const filteredExtras = allExtras.filter(extra => {
        if (areaFilter && extra.area_id !== areaFilter) return false;
        if (categoryFilter && extra.type !== categoryFilter) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Activities & Services</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Discover local businesses, attractions, and services around Loch Ness.
            </p>

            <UnofficialDisclaimer />

            <div className="grid lg:grid-cols-4 gap-8 mt-8">
                {/* Filters */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Filter</h3>
                            {(areaFilter || categoryFilter) && (
                                <button
                                    onClick={() => router.push('/extras')}
                                    className="text-xs text-slate-500 hover:text-red-500"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Category</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => updateFilter('category', null)}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm capitalize ${!categoryFilter ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                >
                                    All Categories
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => updateFilter('category', cat)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm capitalize ${categoryFilter === cat ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Area Filter */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Area</h4>
                            <div className="space-y-2">
                                {areas.map(area => (
                                    <button
                                        key={area.id}
                                        onClick={() => updateFilter('area', areaFilter === area.id ? null : area.id)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${areaFilter === area.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {area.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-3">
                    <p className="text-sm text-slate-500 mb-4">
                        Showing {filteredExtras.length} result{filteredExtras.length !== 1 ? 's' : ''}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredExtras.map(extra => (
                            <Link key={extra.id} href={`/extras/${extra.slug}`} className="block group">
                                <div className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow h-full">
                                    <span className="text-sm font-bold text-brand-green uppercase tracking-wide">{extra.type}</span>
                                    <h2 className="text-xl font-bold mt-2 group-hover:text-brand-green">{extra.name}</h2>
                                    <p className="text-slate-600 mt-2 text-sm line-clamp-2">{extra.description}</p>
                                    <div className="flex items-center text-slate-500 text-sm mt-4">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="capitalize">{extra.area_id.replace('-', ' ')}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {filteredExtras.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p>No results match your filters.</p>
                            <button
                                onClick={() => router.push('/extras')}
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
