'use client';

import dynamic from 'next/dynamic';

const TrailMap = dynamic(() => import('./TrailMap'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl" />
});

export default function TrailMapWrapper(props: any) {
    return <TrailMap {...props} />;
}
