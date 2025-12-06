import { notFound } from "next/navigation";
import Link from "next/link";
import { getFAQs } from "@/lib/data";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { ArrowLeft } from "lucide-react";

// Helper
const getFAQBySlug = (slug: string) => {
    return getFAQs().find(f => f.slug === slug);
}

export async function generateStaticParams() {
    const faqs = getFAQs();
    return faqs.map((faq) => ({
        slug: faq.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const faq = getFAQBySlug(slug);
    if (!faq) return { title: "FAQ Not Found" };

    return {
        title: `${faq.question} | Loch Ness FAQ`,
        description: faq.short_answer,
    };
}

export default async function FAQDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const faq = getFAQBySlug(slug);

    if (!faq) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Link href="/faq" className="text-sm text-slate-500 hover:text-brand-green mb-6 inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to FAQ
                </Link>

                <h1 className="text-3xl font-bold mb-6 text-slate-900">{faq.question}</h1>

                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm mb-8">
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Short Answer</h3>
                        <p className="text-lg font-medium text-slate-900">{faq.short_answer}</p>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Details</h3>
                        <p>{faq.extended_content}</p>
                    </div>

                    {faq.related_links && faq.related_links.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h4 className="font-semibold mb-3">Related Pages</h4>
                            <ul className="space-y-2">
                                {faq.related_links.map((link, idx) => (
                                    <li key={idx}>
                                        <Link href={link.href} className="text-brand-green hover:underline">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <UnofficialDisclaimer />
            </div>
        </div>
    );
}
