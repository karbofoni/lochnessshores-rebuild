'use client';

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Trail } from '@/lib/types';

interface FitnessResult {
    rating: number;
    verdict: 'Suitable' | 'Borderline' | 'Not Recommended';
    explanation: string;
    alternative_trail_ids: string[];
    alternatives: Trail[];
}

interface TrailFitnessCheckerProps {
    trailSlug: string;
}

export function TrailFitnessChecker({ trailSlug }: TrailFitnessCheckerProps) {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<FitnessResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/trail-fitness', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trail_slug: trailSlug,
                    fitness_description: description,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to check fitness');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const getVerdictIcon = (verdict: string) => {
        switch (verdict) {
            case 'Suitable':
                return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'Borderline':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'Not Recommended':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case 'Suitable':
                return 'bg-emerald-50 border-emerald-200 text-emerald-700';
            case 'Borderline':
                return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'Not Recommended':
                return 'bg-red-50 border-red-200 text-red-700';
            default:
                return '';
        }
    };

    return (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-slate-800 text-sm">Am I fit enough for this trail?</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your fitness level, e.g. 'I can handle 10km on flat ground but struggle with steep climbs. I have mild knee issues.'"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                    rows={2}
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !description.trim()}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Checking...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Check suitability
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-4 space-y-3">
                    <div className={`p-3 rounded-lg border flex items-start gap-3 ${getVerdictColor(result.verdict)}`}>
                        {getVerdictIcon(result.verdict)}
                        <div>
                            <div className="font-semibold">{result.verdict}</div>
                            <p className="text-sm mt-1">{result.explanation}</p>
                        </div>
                    </div>

                    {result.alternatives.length > 0 && (
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                Alternative trails you might prefer
                            </h4>
                            <div className="space-y-2">
                                {result.alternatives.map(trail => (
                                    <Link
                                        key={trail.id}
                                        href={`/trails/${trail.slug}`}
                                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group transition-colors"
                                    >
                                        <div>
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">
                                                {trail.name}
                                            </span>
                                            <span className="ml-2 text-xs text-slate-500">
                                                {trail.distance_miles?.toFixed(1) || trail.distance_km}mi • {trail.difficulty}
                                            </span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
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
