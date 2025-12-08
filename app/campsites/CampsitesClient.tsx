"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CampsiteCard } from "@/components/CampsiteCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { CampsiteFinder } from "@/components/CampsiteFinder";
import type { Campsite, Area, StayType, FacilityTag } from "@/lib/types";

// Import data directly for client-side use
import campsitesData from "@/data/campsites.json";
import areasData from "@/data/areas.json";
import stayTypesData from "@/data/stay_types.json";
import facilityTagsData from "@/data/facility_tags.json";

export default function CampsitesClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const allCampsites = campsitesData as Campsite[];
    const areas = areasData as Area[];
    const stayTypes = stayTypesData as StayType[];
    const facilityTags = facilityTagsData as FacilityTag[];

    const [areaFilter, setAreaFilter] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [facilityFilter, setFacilityFilter] = useState<string | null>(null);

    // Sync URL params to state on mount
    useEffect(() => {
        setAreaFilter(searchParams.get('area'));
        setTypeFilter(searchParams.get('type'));
        setFacilityFilter(searchParams.get('facility'));
    }, [searchParams]);

    // Update URL when filters change
    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/campsites?${params.toString()}`);
    };

    // Filter Logic
    const filteredCampsites = allCampsites.filter((site) => {
        if (areaFilter && site.area_id !== areaFilter) return false;
        if (typeFilter && !site.stay_types.includes(typeFilter)) return false;
        if (facilityFilter && !site.facility_tags.includes(facilityFilter)) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Campsites around Loch Ness</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Browse our independent directory of campsites, glamping pods, and caravan sites.
                Use the filters to find the perfect spot for your adventure.
            </p>

            <CampsiteFinder />

            <UnofficialDisclaimer />

            <div className="grid lg:grid-cols-4 gap-8 mt-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Filter Campsites</h3>
                            {(areaFilter || typeFilter || facilityFilter) && (
                                <button
                                    onClick={() => router.push('/campsites')}
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

                        {/* Stay Types */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Stay Type</h4>
                            <div className="space-y-2">
                                {stayTypes.map(st => (
                                    <button
                                        key={st.id}
                                        onClick={() => updateFilter('type', typeFilter === st.id ? null : st.id)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${typeFilter === st.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {st.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Facilities */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Facilities</h4>
                            <div className="flex flex-wrap gap-2">
                                {facilityTags.map(ft => (
                                    <button
                                        key={ft.id}
                                        onClick={() => updateFilter('facility', facilityFilter === ft.id ? null : ft.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${facilityFilter === ft.id ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {ft.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-3">
                    <p className="text-sm text-slate-500 mb-4">
                        Showing {filteredCampsites.length} campsite{filteredCampsites.length !== 1 ? 's' : ''}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredCampsites.map((site) => (
                            <CampsiteCard key={site.id} campsite={site} />
                        ))}
                    </div>
                    {filteredCampsites.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p>No campsites match your filters.</p>
                            <button
                                onClick={() => router.push('/campsites')}
                                className="text-brand-green hover:underline mt-2"
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
