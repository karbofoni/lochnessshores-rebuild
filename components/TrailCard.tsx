import Link from "next/link";
import { Trail } from "@/lib/types";
import { MapPin, UserRound } from "lucide-react";

interface TrailCardProps {
    trail: Trail;
}

export function TrailCard({ trail }: TrailCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-48 bg-slate-200 relative">
                {trail.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={trail.photos[0]}
                        alt={trail.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <MapPin className="w-12 h-12" />
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-bold text-brand-green uppercase tracking-wide">
                            {trail.type}
                        </span>
                        <h3 className="font-bold text-lg leading-tight">
                            <Link href={`/trails/${trail.slug}`} className="hover:text-brand-green hover:underline">
                                {trail.name}
                            </Link>
                        </h3>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-slate-900">{trail.distance_km}km</span>
                        <span className="text-xs text-slate-500 capitalize">{trail.difficulty}</span>
                    </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {trail.summary}
                </p>

                <div className="flex justify-between items-center text-xs text-slate-500 border-t pt-3">
                    <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{trail.area_id}</span>
                    </div>
                    <Link href={`/trails/${trail.slug}`} className="font-medium text-brand-green hover:underline">
                        View Route &rarr;
                    </Link>
                </div>
            </div>
            );
}
