"use client";

import { useSearchParams } from "next/navigation";
import { Trail } from "@/lib/types";
import { TrailCard } from "@/components/TrailCard";
import { Area } from "@/lib/types";
import Link from "next/link";

interface TrailSearchProps {
    allTrails: Trail[];
    areas: Area[];
}

export function TrailSearch({ allTrails, areas }: TrailSearchProps) {
    const searchParams = useSearchParams();
    const areaFilter = searchParams.get("area");

    const filteredTrails = allTrails.filter((trail) => {
        if (areaFilter && !areaFilter.split(',').includes(trail.area_id)) return false;
        return true;
    });

    return (
        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                    <h3 className="font-semibold mb-3">Filter by Area</h3>
                    <div className="space-y-2">
                        {areas.map(area => (
                            <Link
                                key={area.id}
                                href={`/trails?area=${area.id}`}
                                className="block text-sm text-slate-700 hover:text-brand-green"
                            >
                                {area.name}
                            </Link>
                        ))}
                        <Link href="/trails" className="block text-sm text-slate-500 underline mt-4">Clear Filters</Link>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-3">
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredTrails.map((trail) => (
                        <TrailCard key={trail.id} trail={trail} />
                    ))}
                </div>
                {filteredTrails.length === 0 && (
                    <p>No trails found.</p>
                )}
            </div>
        </div>
    );
}
