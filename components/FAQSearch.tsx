'use client';

import { useState } from 'react';
import { Search, Loader2, MessageCircle, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
    slug: string;
    question: string;
    short_answer: string;
}

interface SuggestedPage {
    type: 'campsite' | 'trail' | 'guide' | 'faq';
    path: string;
    label: string;
}

interface SearchResult {
    answer: string;
    faqs: FAQ[];
    suggested_pages: SuggestedPage[];
}

export function FAQSearch() {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SearchResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/faq-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) {
                throw new Error('Failed to search');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'campsite':
                return '🏕️';
            case 'trail':
                return '🥾';
            case 'guide':
                return '📖';
            case 'faq':
                return '❓';
            default:
                return '🔗';
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                    Ask anything about camping around Loch Ness
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g. Are there dog-friendly campsites near Foyers?"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-700 placeholder:text-slate-400"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Searching...
                        </>
                    ) : (
                        <>
                            <Search className="w-4 h-4" />
                            Ask
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 space-y-4">
                    {/* Answer */}
                    <div className="p-4 bg-white rounded-xl border border-blue-100">
                        <p className="text-slate-700">{result.answer}</p>
                    </div>

                    {/* Related FAQs */}
                    {result.faqs.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-1">
                                <HelpCircle className="w-4 h-4" />
                                Related FAQ
                            </h3>
                            <div className="space-y-2">
                                {result.faqs.map((faq) => (
                                    <Link
                                        key={faq.slug}
                                        href={`/faq#${faq.slug}`}
                                        className="block p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
                                    >
                                        <div className="font-medium text-slate-800 text-sm">
                                            {faq.question}
                                        </div>
                                        <div className="text-slate-500 text-sm mt-1">
                                            {faq.short_answer}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggested Pages */}
                    {result.suggested_pages.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-600 mb-2">
                                Explore more
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.suggested_pages.map((page, i) => (
                                    <Link
                                        key={i}
                                        href={page.path}
                                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-sm"
                                    >
                                        <span>{getTypeIcon(page.type)}</span>
                                        <span className="text-slate-700">{page.label}</span>
                                        <ArrowRight className="w-3 h-3 text-slate-400" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
