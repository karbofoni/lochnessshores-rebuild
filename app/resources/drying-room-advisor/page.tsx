'use client';

import { useState } from 'react';
import { Droplets, Loader2, Building2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const PROPERTY_TYPES = [
    { id: 'campsite-drying-room', label: 'Campsite drying room' },
    { id: 'glamping-pod', label: 'Glamping pod' },
    { id: 'holiday-cottage', label: 'Holiday cottage' },
    { id: 'b-and-b', label: 'B&B / Guesthouse' },
    { id: 'campervan-hire', label: 'Campervan hire' },
    { id: 'hostel', label: 'Hostel / Bunkhouse' },
];

const ISSUES = [
    { id: 'wet-boots', label: 'Wet boots and footwear' },
    { id: 'condensation', label: 'Condensation on windows/walls' },
    { id: 'damp-clothes', label: 'Damp clothing and gear' },
    { id: 'musty-smell', label: 'Musty/damp smell' },
    { id: 'ski-gear', label: 'Ski/snowsports gear' },
    { id: 'general', label: 'General dampness' },
];

const BUDGETS = [
    { id: 'low', label: 'Low (< £200)' },
    { id: 'medium', label: 'Medium (£200-500)' },
    { id: 'high', label: 'High (£500+)' },
];

export default function DryingRoomAdvisorPage() {
    const [propertyType, setPropertyType] = useState('');
    const [size, setSize] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [mainIssue, setMainIssue] = useState('');
    const [budget, setBudget] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [advice, setAdvice] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!propertyType || !mainIssue) return;

        setLoading(true);
        setError(null);
        setAdvice(null);

        try {
            const response = await fetch('/api/drying-advisor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    property_type: propertyType,
                    size,
                    guest_count: guestCount,
                    main_issue: mainIssue,
                    budget,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get advice');
            }

            const data = await response.json();
            setAdvice(data.advice);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Droplets className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-slate-800">Drying Room Advisor</h1>
                </div>
                <p className="text-slate-600">
                    Expert advice for accommodation providers on managing damp and wet gear
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h2 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-slate-600" />
                        Tell us about your property
                    </h2>

                    {/* Property Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Property type *
                        </label>
                        <select
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                        >
                            <option value="">Select property type</option>
                            {PROPERTY_TYPES.map(pt => (
                                <option key={pt.id} value={pt.id}>{pt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Size & Guests */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Size (sq ft or rooms)
                            </label>
                            <input
                                type="text"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                placeholder="e.g. 200 sq ft"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Max guests
                            </label>
                            <input
                                type="text"
                                value={guestCount}
                                onChange={(e) => setGuestCount(e.target.value)}
                                placeholder="e.g. 6"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Main Issue */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Main issue *
                        </label>
                        <select
                            value={mainIssue}
                            onChange={(e) => setMainIssue(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                        >
                            <option value="">Select main issue</option>
                            {ISSUES.map(issue => (
                                <option key={issue.id} value={issue.id}>{issue.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Budget level
                        </label>
                        <div className="flex gap-2">
                            {BUDGETS.map(b => (
                                <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => setBudget(b.id)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${budget === b.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                >
                                    {b.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !propertyType || !mainIssue}
                        className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating advice...
                            </>
                        ) : (
                            <>
                                <Droplets className="w-5 h-5" />
                                Get Expert Advice
                            </>
                        )}
                    </button>
                </form>

                {/* Results */}
                <div>
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                            {error}
                        </div>
                    )}

                    {advice && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h2 className="font-semibold text-lg text-slate-800 mb-4">
                                Your Personalized Advice
                            </h2>
                            <div className="prose prose-slate prose-sm max-w-none prose-headings:text-slate-800 prose-headings:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800">
                                <ReactMarkdown
                                    components={{
                                        a: ({ ...props }) => (
                                            <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline" />
                                        ),
                                    }}
                                >
                                    {advice}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                    {!advice && !error && (
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
                            <Droplets className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">
                                Fill in the form to get personalized drying and dehumidification advice for your property.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
