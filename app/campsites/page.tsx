import { getCampsites, getAreas, getStayTypes, getFacilityTags } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";
import { FilterControls } from "@/components/FilterControls";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";

export const metadata = {
    title: "Campsites around Loch Ness | Unofficial Directory",
    description: "Find the best campsites, glamping pods, and campervan pitches around Loch Ness.",
};

// Force dynamic for search pages (required for searchParams in some Next.js configs)
export const dynamic = 'force-dynamic';

export default function CampsitesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const allCampsites = getCampsites();
    const areas = getAreas();
    const stayTypes = getStayTypes();
    const facilityTags = getFacilityTags();

    // Filter Logic
    const filteredCampsites = allCampsites.filter((site) => {
        const areaFilter = searchParams.area as string;
        const typeFilter = searchParams.type as string;
        const facilityFilter = searchParams.facility as string;

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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Campsites around Loch Ness</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Browse our independent directory of campsites, glamping pods, and caravan sites.
                Use the filters to find the perfect spot for your adventure.
            </p>

            <UnofficialDisclaimer />

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <FilterControls
                        areas={areas}
                        stayTypes={stayTypes}
                        facilityTags={facilityTags}
                    />
                </div>

                {/* Results Grid */}
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
        </div>
    );
}
