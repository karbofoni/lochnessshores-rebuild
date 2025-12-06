import { Suspense } from "react";
import CampsitesClient from "./CampsitesClient";

export const metadata = {
    title: "Campsites around Loch Ness | Unofficial Directory",
    description: "Find the best campsites, glamping pods, and campervan pitches around Loch Ness.",
};

function LoadingFallback() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Campsites around Loch Ness</h1>
            <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl border h-64"></div>
                    </div>
                    <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-xl border h-64"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CampsitesPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <CampsitesClient />
        </Suspense>
    );
}
