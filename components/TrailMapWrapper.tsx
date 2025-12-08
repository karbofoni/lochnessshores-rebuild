'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

const TrailMap = dynamic(() => import('./TrailMap'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl" />
});

interface TrailMapWrapperProps {
    startLat: number;
    startLng: number;
    geometry?: [number, number][];
    name: string;
}

export default function TrailMapWrapper(props: TrailMapWrapperProps) {
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
        <div ref={containerRef} className="h-[400px] w-full">
            {isVisible ? (
                <TrailMap {...props} />
            ) : (
                <div className="h-full w-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <MapPin className="w-8 h-8" />
                </div>
            )}
        </div>
    );
}
