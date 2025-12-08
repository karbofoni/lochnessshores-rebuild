import Link from "next/link";
import Image from "next/image";
import { Campsite } from "@/lib/types";
import { MapPin, Tent } from "lucide-react";

interface CampsiteCardProps {
    campsite: Campsite;
}

export function CampsiteCard({ campsite }: CampsiteCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-48 bg-slate-200 relative overflow-hidden">
                {campsite.photos[0] ? (
                    <Image
                        src={campsite.photos[0]}
                        alt={campsite.display_name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Tent className="w-12 h-12" />
                    </div>
                )}
                {campsite.distance_to_loch_m && campsite.distance_to_loch_m < 200 && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                        Lochside
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-1 leading-tight">
                    <Link href={`/campsites/${campsite.slug}`} className="hover:text-brand-green hover:underline">
                        {campsite.display_name}
                    </Link>
                </h3>
                <div className="flex items-center text-slate-500 text-sm mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{campsite.area_id.replace('-', ' ')}</span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                    {campsite.short_description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                    {campsite.stay_types.map(t => (
                        <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {t.replace('-', ' ')}
                        </span>
                    ))}
                </div>

                <Link
                    href={`/campsites/${campsite.slug}`}
                    className="block w-full text-center bg-brand-green text-white font-medium py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
