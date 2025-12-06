import { getCampsites, getAreas, getStayTypes, getFacilityTags } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import Link from "next/link";

export const metadata = {
    title: "Campsites around Loch Ness | Unofficial Directory",
    description: "Find the best campsites, glamping pods, and campervan pitches around Loch Ness.",
};

export default function CampsitesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const allCampsites = getCampsites();
    const areas = getAreas();
    const stayTypes = getStayTypes();
    const facilityTags = getFacilityTags();

    // Get filter values
    const areaFilter = typeof searchParams.area === 'string' ? searchParams.area : undefined;
    const typeFilter = typeof searchParams.type === 'string' ? searchParams.type : undefined;
    const facilityFilter = typeof searchParams.facility === 'string' ? searchParams.facility : undefined;

    // Filter Logic
    const filteredCampsites = allCampsites.filter((site) => {
        if (areaFilter && site.area_id !== areaFilter) return false;

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

            <div className="grid lg:grid-cols-4 gap-8 mt-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                        <h3 className="font-bold mb-4">Filter Campsites</h3>

                        {/* Area Filter */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Area</h4>
                            <div className="space-y-2">
                                <Link
                                    href="/campsites"
                                    className={`block px-3 py-2 rounded-lg text-sm ${!areaFilter ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                >
                                    All Areas
                                </Link>
                                {areas.map(area => (
                                    <Link
                                        key={area.id}
                                        href={`/campsites?area=${area.id}`}
                                        className={`block px-3 py-2 rounded-lg text-sm ${areaFilter === area.id ? 'bg-brand-green text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {area.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Stay Types */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Stay Type</h4>
                            <div className="space-y-2">
                                {stayTypes.map(st => (
                                    <Link
                                        key={st.id}
                                        href={`/campsites?type=${st.id}${areaFilter ? `&area=${areaFilter}` : ''}`}
                                        className={`block px-3 py-2 rounded-lg text-sm ${typeFilter === st.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {st.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Facilities */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Facilities</h4>
                            <div className="flex flex-wrap gap-2">
                                {facilityTags.slice(0, 6).map(ft => (
                                    <Link
                                        key={ft.id}
                                        href={`/campsites?facility=${ft.id}${areaFilter ? `&area=${areaFilter}` : ''}`}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${facilityFilter === ft.id ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        {ft.label}
                                    </Link>
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
                            <Link href="/campsites" className="text-brand-green hover:underline mt-2 block">
                                Clear all filters
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
