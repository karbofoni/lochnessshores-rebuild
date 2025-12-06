import { notFound } from "next/navigation";
import Link from "next/link";
import { getExtras } from "@/lib/data"; // Need a getExtraBySlug, will implement inline or find
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { ExternalLink, MapPin } from "lucide-react";

export async function generateStaticParams() {
    const extras = getExtras();
    return extras.map((extra) => ({
        slug: extra.slug,
    }));
}

// Helper since I missed adding it to lib/data.ts
const getExtraBySlug = (slug: string) => {
    return getExtras().find(e => e.slug === slug);
}



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const extra = getExtraBySlug(slug);
    if (!extra) return { title: "Not Found" };

    return {
        title: `${extra.name} | Loch Ness Extras`,
        description: extra.summary,
    };
}

export default async function ExtraDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const extra = getExtraBySlug(slug);

    if (!extra) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Link href="/extras" className="text-sm text-slate-500 hover:text-brand-green mb-6 inline-block">
                    &larr; Back to activities
                </Link>

                <span className="block text-brand-green text-sm font-bold uppercase tracking-wide mb-2">{extra.category}</span>
                <h1 className="text-4xl font-bold mb-4">{extra.name}</h1>

                <div className="flex items-center text-slate-600 mb-8">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="capitalize">{extra.area_id.replace('-', ' ')}</span>
                </div>

                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm mb-8">
                    <p className="text-lg text-slate-700 leading-relaxed mb-6">
                        {extra.summary}
                    </p>

                    {extra.website_url && (
                        <a
                            href={extra.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    )}
                </div>

                <UnofficialDisclaimer />
            </div>
        </div>
    );
}
