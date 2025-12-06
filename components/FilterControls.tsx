"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Area, FacilityTag, StayType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterControlsProps {
    areas: Area[];
    stayTypes: StayType[];
    facilityTags: FacilityTag[];
}

export function FilterControls({ areas, stayTypes, facilityTags }: FilterControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentValues = params.get(key)?.split(",") || [];

        if (currentValues.includes(value)) {
            const newValues = currentValues.filter((v) => v !== value);
            if (newValues.length > 0) {
                params.set(key, newValues.join(","));
            } else {
                params.delete(key);
            }
        } else {
            currentValues.push(value);
            params.set(key, currentValues.join(","));
        }

        router.push(`?${params.toString()}`);
    };

    const isSelected = (key: string, value: string) => {
        const currentValues = searchParams.get(key)?.split(",") || [];
        return currentValues.includes(value);
    };

    return (
        <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
            <div>
                <h3 className="font-semibold mb-3">Area</h3>
                <div className="space-y-2">
                    {areas.map((area) => (
                        <label key={area.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected("area", area.id)}
                                onChange={() => handleFilterChange("area", area.id)}
                                className="rounded border-slate-300 text-brand-green focus:ring-brand-green"
                            />
                            <span>{area.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Stay Type</h3>
                <div className="space-y-2">
                    {stayTypes.map((type) => (
                        <label key={type.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected("type", type.id)}
                                onChange={() => handleFilterChange("type", type.id)}
                                className="rounded border-slate-300 text-brand-green focus:ring-brand-green"
                            />
                            <span>{type.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Facilities</h3>
                <div className="space-y-2">
                    {facilityTags.map((tag) => (
                        <label key={tag.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected("facility", tag.id)}
                                onChange={() => handleFilterChange("facility", tag.id)}
                                className="rounded border-slate-300 text-brand-green focus:ring-brand-green"
                            />
                            <span>{tag.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <button
                onClick={() => router.push('?')}
                className="w-full text-center text-sm text-slate-500 underline hover:text-slate-700"
            >
                Clear All Filters
            </button>
        </div>
    );
}
