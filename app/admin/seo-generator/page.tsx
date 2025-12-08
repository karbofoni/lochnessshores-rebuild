'use client';

import { useState } from 'react';
import { FileText, Loader2, Copy, Check, Sparkles } from 'lucide-react';

const PAGE_TYPES = [
    { id: 'campsite', label: 'Campsite page' },
    { id: 'trail', label: 'Trail page' },
    { id: 'guide', label: 'Guide article' },
    { id: 'area', label: 'Area page' },
];

export default function SEOGeneratorPage() {
    const [pageType, setPageType] = useState('campsite');
    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [keywords, setKeywords] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        title: string;
        h1: string;
        metaDescription: string;
        faqSuggestions: string[];
    } | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const generateSEO = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/seo-generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page_type: pageType,
                    name,
                    area,
                    keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
                }),
            });

            if (!response.ok) throw new Error('Failed to generate');
            const data = await response.json();
            setResult(data);
        } catch {
            // Fallback to client-side generation
            setResult({
                title: `${name} | ${pageType === 'campsite' ? 'Camping' : 'Hiking'} near ${area || 'Loch Ness'}`,
                h1: `${name}${area ? ` - ${area}` : ''}`,
                metaDescription: `Discover ${name} for your ${pageType === 'campsite' ? 'camping adventure' : 'hiking trip'} around Loch Ness, Scotland. Find details, photos, and booking information.`,
                faqSuggestions: [
                    `What facilities does ${name} offer?`,
                    `How do I get to ${name}?`,
                    `Is ${name} suitable for families?`,
                    `What's the best time to visit ${name}?`,
                ],
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
                <FileText className="w-8 h-8 text-slate-700" />
                <h1 className="text-2xl font-bold text-slate-800">SEO Content Generator</h1>
            </div>

            <p className="text-slate-600 mb-6">
                Generate SEO titles, meta descriptions, and FAQ suggestions for new pages.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-white rounded-2xl p-6 border border-slate-200">
                    {/* Page Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Page type
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PAGE_TYPES.map(pt => (
                                <button
                                    key={pt.id}
                                    onClick={() => setPageType(pt.id)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pageType === pt.id
                                            ? 'bg-slate-800 text-white'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                >
                                    {pt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Name / Title *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Loch Ness Shores Camping"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Area */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Area / Location
                        </label>
                        <input
                            type="text"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            placeholder="e.g. South Shore, Foyers"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Keywords */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Target keywords (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g. wild camping, lochside, dog friendly"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <button
                        onClick={generateSEO}
                        disabled={loading || !name.trim()}
                        className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate SEO Content
                            </>
                        )}
                    </button>
                </div>

                {/* Results */}
                <div>
                    {result && (
                        <div className="space-y-4">
                            {/* Title */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Title Tag</label>
                                    <button
                                        onClick={() => copyToClipboard(result.title, 'title')}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        {copied === 'title' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-slate-800 font-medium">{result.title}</p>
                                <p className="text-xs text-slate-400 mt-1">{result.title.length} chars</p>
                            </div>

                            {/* H1 */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">H1 Heading</label>
                                    <button
                                        onClick={() => copyToClipboard(result.h1, 'h1')}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        {copied === 'h1' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-slate-800 font-medium">{result.h1}</p>
                            </div>

                            {/* Meta Description */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Meta Description</label>
                                    <button
                                        onClick={() => copyToClipboard(result.metaDescription, 'meta')}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        {copied === 'meta' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-slate-700 text-sm">{result.metaDescription}</p>
                                <p className="text-xs text-slate-400 mt-1">{result.metaDescription.length} chars</p>
                            </div>

                            {/* FAQ Suggestions */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200">
                                <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                                    FAQ Suggestions
                                </label>
                                <ul className="space-y-2">
                                    {result.faqSuggestions.map((faq, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                            <span className="text-slate-400">Q{i + 1}.</span>
                                            {faq}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
