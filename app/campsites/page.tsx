import { getCampsites } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";

export const metadata = {
    title: "Campsites around Loch Ness | Unofficial Directory",
    description: "Find the best campsites, glamping pods, and campervan pitches around Loch Ness.",
};

export default function CampsitesPage() {
    const allCampsites = getCampsites();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Campsites around Loch Ness</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Browse our independent directory of campsites, glamping pods, and caravan sites.
                Click on any campsite to see full details, location, and booking information.
            </p>

            <UnofficialDisclaimer />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {allCampsites.map((site) => (
                    <CampsiteCard key={site.id} campsite={site} />
                ))}
            </div>
        </div>
    );
}
