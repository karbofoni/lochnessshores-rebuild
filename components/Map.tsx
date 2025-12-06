'use client';

import dynamic from 'next/dynamic';
import { Campsite } from '@/lib/types';

// Dynamically import the LeafletMap component with SSR disabled
const LeafletMap = dynamic(() => import('./LeafletMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>
});

interface MapProps {
    campsite: Campsite;
}

export default function Map({ campsite }: MapProps) {
    return <LeafletMap campsite={campsite} />;
}
