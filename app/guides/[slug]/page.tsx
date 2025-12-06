import { notFound } from "next/navigation";
import Link from "next/link";
import { getGuideData } from "@/lib/posts";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { ArrowLeft } from "lucide-react";
import { StayingDryBlock } from "@/components/StayingDryBlock";

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const guide = await getGuideData(params.slug);
    if (!guide) return { title: "Guide Not Found" };

    return {
        title: `${guide.title} | Loch Ness Guides`,
        description: guide.excerpt,
    };
}

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
    const guide = await getGuideData(params.slug);

    if (!guide) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/guides" className="text-sm text-slate-500 hover:text-brand-green mb-6 inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to guides
                </Link>

                <h1 className="text-4xl font-bold mb-4 text-slate-900 leading-tight">{guide.title}</h1>
                <p className="text-xl text-slate-600 mb-8 font-light">
                    {guide.excerpt}
                </p>

                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm mb-8">
                    <div
                        className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-brand-green"
                        dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
                    />
                </div>

                <StayingDryBlock />
                <UnofficialDisclaimer />
            </div>
        </div>
    );
}
