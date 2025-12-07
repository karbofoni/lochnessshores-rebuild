"use client";

interface OpenStreetMapEmbedProps {
    latitude: number;
    longitude: number;
    name: string;
    zoom?: number;
}

export function OpenStreetMapEmbed({ latitude, longitude, name, zoom = 14 }: OpenStreetMapEmbedProps) {
    // OpenStreetMap embed URL with marker
    const bbox = 0.02; // Bounding box offset for zoom
    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - bbox}%2C${latitude - bbox}%2C${longitude + bbox}%2C${latitude + bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;

    const fullMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;

    return (
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
                title={`Map showing ${name}`}
                width="100%"
                height="300"
                src={embedUrl}
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="bg-slate-100"
            />
            <div className="bg-slate-50 px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-slate-600">
                    📍 {latitude.toFixed(4)}°N, {Math.abs(longitude).toFixed(4)}°W
                </span>
                <a
                    href={fullMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-green hover:underline font-medium"
                >
                    View larger map →
                </a>
            </div>
        </div>
    );
}
