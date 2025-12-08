'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Campsite } from '@/lib/types';
import { MapPin } from 'lucide-react';

// Dynamically import the LeafletMap component with SSR disabled
const LeafletMap = dynamic(() => import('./LeafletMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>
});

interface MapProps {
    campsite: Campsite;
}

export default function Map({ campsite }: MapProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only load once
                }
            },
            {
                rootMargin: '200px', // Start loading 200px before visible
                threshold: 0.01,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="h-full w-full">
            {isVisible ? (
                <LeafletMap campsite={campsite} />
            ) : (
                <div className="h-full w-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <MapPin className="w-8 h-8" />
                </div>
            )}
        </div>
    );
}
