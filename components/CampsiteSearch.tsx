"use client";

import { useSearchParams } from "next/navigation";
import { Campsite } from "@/lib/types";
import { CampsiteCard } from "@/components/CampsiteCard";
import { FilterControls } from "@/components/FilterControls";
import { Area, StayType, FacilityTag } from "@/lib/types";

interface CampsiteSearchProps {
    allCampsites: Campsite[];
    areas: Area[];
    stayTypes: StayType[];
    facilityTags: FacilityTag[];
}

export function CampsiteSearch({ allCampsites, areas, stayTypes, facilityTags }: CampsiteSearchProps) {
    const searchParams = useSearchParams();
    const areaFilter = searchParams.get("area");
    const typeFilter = searchParams.get("type");
    const facilityFilter = searchParams.get("facility");

    const filteredCampsites = allCampsites.filter((site) => {
        if (areaFilter && !areaFilter.split(',').includes(site.area_id)) return false;

        if (typeFilter) {
            const selectedTypes = typeFilter.split(',');
            if (!site.stay_types.some(t => selectedTypes.includes(t))) return false;
        }

        if (facilityFilter) {
            const selectedFacilities = facilityFilter.split(',');
            if (!site.facility_tags.some(f => selectedFacilities.includes(f))) return false;
        }

        return true;
    });

    return (
        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <FilterControls
                    areas={areas}
                    stayTypes={stayTypes}
                    facilityTags={facilityTags}
                />
            </div>

            <div className="lg:col-span-3">
                <div className="mb-4 text-sm text-slate-500">
                    Showing {filteredCampsites.length} result{filteredCampsites.length !== 1 && 's'}
                </div>

                {filteredCampsites.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredCampsites.map((site) => (
                            <CampsiteCard key={site.id} campsite={site} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 p-8 rounded-lg text-center text-slate-600">
                        <p className="text-lg font-medium mb-2">No campsites found matching your filters.</p>
                        <p>Try adjusting your search criteria or clear some filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
