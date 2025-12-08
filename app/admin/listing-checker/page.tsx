'use client';

import { useState } from 'react';
import { ClipboardCheck, Loader2, AlertTriangle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

export default function ListingCheckerPage() {
    const [jsonInput, setJsonInput] = useState('');
    const [listingType, setListingType] = useState<'campsite' | 'trail'>('campsite');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        valid: boolean;
        errors: string[];
        warnings: string[];
        suggestions: string[];
    } | null>(null);

    const validateListing = async () => {
        setLoading(true);
        setResult(null);

        try {
            const parsed = JSON.parse(jsonInput);
            const errors: string[] = [];
            const warnings: string[] = [];
            const suggestions: string[] = [];

            if (listingType === 'campsite') {
                // Required fields
                const required = ['id', 'slug', 'display_name', 'latitude', 'longitude', 'area_id', 'stay_types', 'facility_tags'];
                required.forEach(field => {
                    if (!parsed[field]) errors.push(`Missing required field: ${field}`);
                });

                // Type checks
                if (parsed.latitude && (parsed.latitude < 55 || parsed.latitude > 59)) {
                    warnings.push(`Latitude ${parsed.latitude} seems outside Highland Scotland range (55-59)`);
                }
                if (parsed.longitude && (parsed.longitude < -8 || parsed.longitude > -2)) {
                    warnings.push(`Longitude ${parsed.longitude} seems outside Highland Scotland range (-8 to -2)`);
                }

                // Consistency checks
                if (parsed.short_description?.toLowerCase().includes('lochside') && (!parsed.distance_to_loch_m || parsed.distance_to_loch_m > 500)) {
                    warnings.push('Description says "lochside" but distance_to_loch_m is missing or > 500m');
                }

                if (!parsed.external_booking_url) {
                    warnings.push('No external_booking_url - users won\'t be able to book');
                }

                if (!parsed.photos || parsed.photos.length === 0) {
                    warnings.push('No photos - considers adding at least one image');
                }

                // Suggestions
                if (parsed.facility_tags && !parsed.facility_tags.includes('dog-friendly')) {
                    suggestions.push('Consider adding dog-friendly tag if applicable - popular filter');
                }
                if (!parsed.has_drying_room) {
                    suggestions.push('Consider adding has_drying_room field - useful for wet weather gear');
                }

            } else {
                // Trail validation
                const required = ['id', 'slug', 'name', 'latitude', 'longitude', 'area_id', 'difficulty'];
                required.forEach(field => {
                    if (!parsed[field]) errors.push(`Missing required field: ${field}`);
                });

                if (!parsed.distance_miles && !parsed.distance_km) {
                    errors.push('Missing distance_miles or distance_km');
                }

                if (!parsed.summary) {
                    warnings.push('No summary - add a description for better UX');
                }

                if (!parsed.geometry || parsed.geometry.length === 0) {
                    warnings.push('No geometry data - map won\'t show trail route');
                }

                if (!parsed.highlights || parsed.highlights.length === 0) {
                    suggestions.push('Add highlights array for better trail cards');
                }
            }

            setResult({
                valid: errors.length === 0,
                errors,
                warnings,
                suggestions,
            });
        } catch {
            setResult({
                valid: false,
                errors: ['Invalid JSON - please check syntax'],
                warnings: [],
                suggestions: [],
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
                <ClipboardCheck className="w-8 h-8 text-slate-700" />
                <h1 className="text-2xl font-bold text-slate-800">Listing Sanity Checker</h1>
            </div>

            <p className="text-slate-600 mb-6">
                Paste your campsite or trail JSON to check for missing fields, inconsistencies, and get improvement suggestions.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        {(['campsite', 'trail'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setListingType(type)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${listingType === type
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={`Paste your ${listingType} JSON here...`}
                        className="w-full h-80 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none font-mono text-sm"
                    />

                    <button
                        onClick={validateListing}
                        disabled={loading || !jsonInput.trim()}
                        className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Checking...
                            </>
                        ) : (
                            <>
                                <ClipboardCheck className="w-5 h-5" />
                                Validate Listing
                            </>
                        )}
                    </button>
                </div>

                <div>
                    {result && (
                        <div className="space-y-4">
                            {/* Status */}
                            <div className={`p-4 rounded-xl border ${result.valid ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-center gap-2">
                                    {result.valid ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <span className="font-semibold text-emerald-700">Valid listing</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5 text-red-600" />
                                            <span className="font-semibold text-red-700">Invalid listing</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Errors */}
                            {result.errors.length > 0 && (
                                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                    <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-1">
                                        <XCircle className="w-4 h-4" /> Errors
                                    </h3>
                                    <ul className="space-y-1">
                                        {result.errors.map((e, i) => (
                                            <li key={i} className="text-sm text-red-600">• {e}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Warnings */}
                            {result.warnings.length > 0 && (
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                    <h3 className="font-semibold text-amber-700 mb-2 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" /> Warnings
                                    </h3>
                                    <ul className="space-y-1">
                                        {result.warnings.map((w, i) => (
                                            <li key={i} className="text-sm text-amber-600">• {w}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Suggestions */}
                            {result.suggestions.length > 0 && (
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                                        <Lightbulb className="w-4 h-4" /> Suggestions
                                    </h3>
                                    <ul className="space-y-1">
                                        {result.suggestions.map((s, i) => (
                                            <li key={i} className="text-sm text-blue-600">• {s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
