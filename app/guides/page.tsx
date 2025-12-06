import Link from "next/link";

export const metadata = {
    title: "Guides & Inspiration | Loch Ness Camping",
    description: "Seasonal guides, best-of lists, and camping tips.",
};

export default function GuidesIndexPage() {
    // In a real app, we'd have a list of available guides in data/guides.json or similar.
    // For now, hardcoding the links to match the PRD templates/examples
    const guides = [
        {
            slug: "best-hiking-campsites-for-families-in-south-loch-ness",
            title: "Best Hiking Campsites for Families in South Loch Ness",
            excerpt: "Discover the perfect base camps for little legs and big adventures on the quieter side of the loch."
        },
        {
            slug: "winter-camping-around-loch-ness",
            title: "Winter Camping Guide",
            excerpt: "How to stay warm, dry, and safe when the temperature drops."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Guides & Inspiration</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {guides.map(guide => (
                    <div key={guide.slug} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 bg-slate-200"></div> {/* Placeholder image */}
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2">
                                <Link href={`/guides/${guide.slug}`} className="hover:text-brand-green hover:underline">
                                    {guide.title}
                                </Link>
                            </h2>
                            <p className="text-slate-600 mb-4">{guide.excerpt}</p>
                            <Link href={`/guides/${guide.slug}`} className="text-brand-green font-semibold hover:underline">
                                Read Guide &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
