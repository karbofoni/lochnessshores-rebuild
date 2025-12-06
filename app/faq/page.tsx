import Link from "next/link";
import { getFAQs } from "@/lib/data";
import { UnofficialDisclaimer } from "@/components/UnofficialDisclaimer";
import { HelpCircle, ChevronRight } from "lucide-react";

export const metadata = {
    title: "Camping FAQ | Loch Ness Guide",
    description: "Common questions about wild camping, midges, and facilities around Loch Ness.",
};

export default function FAQIndexPage() {
    const faqs = getFAQs();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-slate-600 mb-8 max-w-2xl">
                Everything you need to know about camping in the Highlands.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                {faqs.map(faq => (
                    <Link key={faq.slug} href={`/faq/${faq.slug}`} className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow h-full flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <HelpCircle className="h-6 w-6 text-brand-green bg-green-50 rounded-full p-1" />
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-green" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 group-hover:text-brand-green">{faq.question}</h3>
                            <p className="text-slate-600 text-sm line-clamp-2">
                                {faq.short_answer}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <UnofficialDisclaimer />
        </div>
    );
}
