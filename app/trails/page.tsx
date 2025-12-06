import { Suspense } from "react";
import TrailsClient from "./TrailsClient";

export const metadata = {
    title: "Hiking Trails around Loch Ness | Unofficial Guide",
    description: "Discover the best trails around Loch Ness for all abilities.",
};

function LoadingFallback() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Hiking Trails around Loch Ness</h1>
            <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl border h-48"></div>
                    </div>
                    <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white rounded-xl border h-48"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TrailsPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <TrailsClient />
        </Suspense>
    );
}
