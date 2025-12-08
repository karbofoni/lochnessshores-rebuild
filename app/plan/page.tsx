'use client';

import { useState } from 'react';
import { Sparkles, Loader2, MapPin, Calendar, Users } from 'lucide-react';
import { TripItinerary } from '@/components/TripItinerary';

const TRAVEL_STYLES = [
    { id: 'family', label: 'Family with kids', icon: '👨‍👩‍👧‍👦' },
    { id: 'couple', label: 'Couple', icon: '💑' },
    { id: 'solo', label: 'Solo adventurer', icon: '🎒' },
    { id: 'hiker', label: 'Serious hiker', icon: '🥾' },
    { id: 'vanlife', label: 'Van/campervan', icon: '🚐' },
];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const INTERESTS = [
    { id: 'hiking', label: 'Hiking' },
    { id: 'wildlife', label: 'Wildlife' },
    { id: 'photography', label: 'Photography' },
    { id: 'history', label: 'History' },
    { id: 'loch-monster', label: 'Nessie hunting' },
    { id: 'pubs', label: 'Pubs & food' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'cycling', label: 'Cycling' },
];

interface TripPlan {
    summary: string;
    days: Array<{
        day: number;
        title: string;
        description: string;
        campsite_ids: string[];
        trail_ids: string[];
        extra_ids: string[];
        activities: string[];
        campsites: unknown[];
        trails: unknown[];
        extras: unknown[];
    }>;
    packing_tips: string[];
}

export default function PlanTripPage() {
    const [origin, setOrigin] = useState('');
    const [days, setDays] = useState(3);
    const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
    const [style, setStyle] = useState('couple');
    const [interests, setInterests] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TripPlan | null>(null);
    const [error, setError] = useState<string | null>(null);

    const toggleInterest = (id: string) => {
        setInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/plan-trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    origin_city: origin,
                    trip_length_days: days,
                    travel_style: style,
                    month,
                    interests,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate trip plan');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Plan Your Loch Ness Adventure</h1>
                <p className="text-slate-600">
                    Get a personalized day-by-day itinerary with real campsites, trails, and local spots
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
                {/* Origin */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <MapPin className="w-4 h-4" />
                        Where are you coming from?
                    </label>
                    <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="e.g. Edinburgh, London, Glasgow"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                    />
                </div>

                {/* Days & Month */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <Calendar className="w-4 h-4" />
                            Trip length
                        </label>
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        >
                            {[2, 3, 4, 5, 7, 10, 14].map(d => (
                                <option key={d} value={d}>{d} days</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Month</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        >
                            {MONTHS.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Travel Style */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <Users className="w-4 h-4" />
                        Travel style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {TRAVEL_STYLES.map(s => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setStyle(s.id)}
                                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${style === s.id
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                            >
                                <span className="mr-1">{s.icon}</span>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Interests */}
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Interests (optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {INTERESTS.map(i => (
                            <button
                                key={i.id}
                                type="button"
                                onClick={() => toggleInterest(i.id)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${interests.includes(i.id)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                            >
                                {i.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || !origin.trim()}
                    className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Planning your adventure...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate My Trip Plan
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-8">
                    {error}
                </div>
            )}

            {result && (
                <TripItinerary
                    summary={result.summary}
                    days={result.days}
                    packing_tips={result.packing_tips}
                />
            )}
        </div>
    );
}
