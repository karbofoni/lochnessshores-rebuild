import Link from "next/link";

export const metadata = {
    title: "Guides & Inspiration | Loch Ness Camping",
    description: "Seasonal guides, best-of lists, and camping tips for Loch Ness.",
};

// pSEO combinations - same as in [slug]/page.tsx
const activities = ['hiking', 'wild-camping', 'fishing', 'cycling', 'paddling', 'relaxing'];
const audiences = ['families', 'couples', 'solo-travelers', 'groups', 'dog-owners'];
const areas = ['south-shore', 'north-shore', 'highlands', 'loch-ness'];

function capitalize(s: string) {
    return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Generate featured guides (subset)
const featuredGuides = [
    { activity: 'hiking', audience: 'families', area: 'highlands' },
    { activity: 'wild-camping', audience: 'couples', area: 'loch-ness' },
    { activity: 'fishing', audience: 'solo-travelers', area: 'south-shore' },
    { activity: 'cycling', audience: 'groups', area: 'north-shore' },
];

export default function GuidesIndexPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Guides & Inspiration</h1>
            <p className="text-slate-600 mb-8 max-w-2xl">
                Explore our collection of camping guides for Loch Ness and the Highlands.
                Find the perfect campsites for your trip based on activity, audience, and area.
            </p>

            {/* Seasonal Guides */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Seasonal Guides</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {['spring', 'summer', 'autumn', 'winter'].map(season => (
                        <Link
                            key={season}
                            href={`/seasonal/${season}-camping-around-loch-ness`}
                            className="block p-6 bg-white rounded-xl border border-slate-100 hover:shadow-md hover:border-brand-green/30 transition-all"
                        >
                            <h3 className="font-bold capitalize text-lg">{season}</h3>
                            <p className="text-sm text-slate-500 mt-1">Camping in {capitalize(season)}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Guides */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Featured Guides</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {featuredGuides.map(({ activity, audience, area }) => {
                        const slug = `best-${activity}-campsites-for-${audience}-in-${area}`;
                        const title = `Best ${capitalize(activity)} Campsites for ${capitalize(audience)} in ${capitalize(area)}`;
                        return (
                            <Link
                                key={slug}
                                href={`/guides/${slug}`}
                                className="block bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group"
                            >
                                <div className="h-32 bg-gradient-to-br from-brand-green/20 to-blue-500/20"></div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-green">{title}</h3>
                                    <p className="text-slate-600 text-sm">
                                        Find the perfect {activity.replace('-', ' ')} campsites for {audience.replace('-', ' ')} in {capitalize(area)}.
                                    </p>
                                    <span className="text-brand-green font-semibold text-sm mt-3 inline-block">
                                        Read Guide →
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Browse by Activity */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Browse by Activity</h2>
                <div className="flex flex-wrap gap-3">
                    {activities.map(activity => (
                        <Link
                            key={activity}
                            href={`/guides/best-${activity}-campsites-for-families-in-loch-ness`}
                            className="px-4 py-2 bg-brand-green/10 text-brand-green rounded-full hover:bg-brand-green hover:text-white transition-colors font-medium capitalize"
                        >
                            {activity.replace('-', ' ')}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Browse by Audience */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Browse by Audience</h2>
                <div className="flex flex-wrap gap-3">
                    {audiences.map(audience => (
                        <Link
                            key={audience}
                            href={`/guides/best-hiking-campsites-for-${audience}-in-loch-ness`}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-500 hover:text-white transition-colors font-medium capitalize"
                        >
                            {audience.replace('-', ' ')}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Browse by Area */}
            <section>
                <h2 className="text-2xl font-bold mb-4">Browse by Area</h2>
                <div className="flex flex-wrap gap-3">
                    {areas.map(area => (
                        <Link
                            key={area}
                            href={`/guides/best-hiking-campsites-for-families-in-${area}`}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-700 hover:text-white transition-colors font-medium capitalize"
                        >
                            {area.replace('-', ' ')}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
