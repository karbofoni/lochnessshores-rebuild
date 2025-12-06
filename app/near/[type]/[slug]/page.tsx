import { notFound } from "next/navigation";
import Link from "next/link";
import { getCampsites, getTrails, getExtras } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { ArrowLeft, MapPin } from "lucide-react";

export async function generateStaticParams() {
    const trails = getTrails();
    const extras = getExtras();

    const params: { type: string; slug: string }[] = [];

    trails.forEach(trail => {
        params.push({ type: 'trail', slug: trail.slug });
    });

    extras.forEach(extra => {
        params.push({ type: 'attraction', slug: extra.slug });
    });

    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ type: string; slug: string }> }) {
    const { type, slug } = await params;

    if (type === 'trail') {
        const trail = getTrails().find(t => t.slug === slug);
        if (trail) {
            return {
                title: `Campsites near ${trail.name} | Loch Ness`,
                description: `Find the best camping options near the ${trail.name} trail in the Loch Ness area.`
            };
        }
    }

    if (type === 'attraction') {
        const extra = getExtras().find(e => e.slug === slug);
        if (extra) {
            return {
                title: `Campsites near ${extra.name} | Loch Ness`,
                description: `Find camping options close to ${extra.name} in the Loch Ness area.`
            };
        }
    }

    return { title: "Nearby Campsites | Loch Ness" };
}

export default async function NearbyPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
    const { type, slug } = await params;
    const allCampsites = getCampsites();

    let entityName = '';
    let entityDescription = '';
    let areaId = '';

    if (type === 'trail') {
        const trail = getTrails().find(t => t.slug === slug);
        if (!trail) notFound();
        entityName = trail!.name;
        entityDescription = trail!.description;
        areaId = trail!.area_id;
    } else if (type === 'attraction') {
        const extra = getExtras().find(e => e.slug === slug);
        if (!extra) notFound();
        entityName = extra!.name;
        entityDescription = extra!.description;
        areaId = extra!.area_id;
    } else {
        notFound();
    }

    const nearbyCampsites = allCampsites.filter(c => c.area_id === areaId || areaId === '');
    const displayCampsites = nearbyCampsites.slice(0, 6);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link href={type === 'trail' ? '/trails' : '/extras'} className="text-sm text-slate-500 hover:text-brand-green mb-6 inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to {type === 'trail' ? 'trails' : 'activities'}
                </Link>

                <h1 className="text-4xl font-bold mb-4 text-slate-900">
                    Campsites near {entityName}
                </h1>

                <div className="flex items-center text-slate-600 mb-6">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="capitalize">{areaId.replace('-', ' ')}</span>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl mb-8">
                    <h2 className="font-bold mb-2">About {entityName}</h2>
                    <p className="text-slate-700">{entityDescription}</p>
                </div>

                <UnofficialDisclaimer />

                <h2 className="text-2xl font-bold mt-8 mb-6">Where to Stay Nearby</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {displayCampsites.map(site => (
                        <CampsiteCard key={site.id} campsite={site} />
                    ))}
                </div>

                {displayCampsites.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <p>No campsites found in this exact area.</p>
                        <Link href="/campsites" className="text-brand-green hover:underline mt-2 block">
                            Browse all campsites
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
