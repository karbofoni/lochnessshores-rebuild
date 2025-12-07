'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

interface TrailMapProps {
    startLat: number;
    startLng: number;
    geometry: [number, number][];
    name: string;
}

// Component to fit map bounds to trail
function MapBounds({ geometry }: { geometry: [number, number][] }) {
    const map = useMap();

    useEffect(() => {
        if (geometry && geometry.length > 0) {
            const bounds = L.latLngBounds(geometry);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, geometry]);

    return null;
}

export default function TrailMap({ startLat, startLng, geometry, name }: TrailMapProps) {
    useEffect(() => {
        // Fix for default marker icon in Next.js
        const DefaultIcon = L.icon({
            iconUrl,
            iconRetinaUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = DefaultIcon;
    }, []);

    // Defensive check for missing coordinates
    if (typeof startLat !== 'number' || typeof startLng !== 'number' || isNaN(startLat) || isNaN(startLng)) {
        return (
            <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center">
                <p className="text-slate-500">Map data unavailable</p>
            </div>
        );
    }

    // If we have geometry, use it. Otherwise fallback to just start point.
    const hasGeometry = geometry && geometry.length > 0;
    const center: [number, number] = [startLat, startLng];

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm z-0 relative">
            <MapContainer
                center={center}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hasGeometry && (
                    <>
                        <Polyline
                            positions={geometry}
                            pathOptions={{ color: '#2E8B57', weight: 4 }}
                        />
                        <MapBounds geometry={geometry} />
                    </>
                )}

                <Marker position={center}>
                    <Popup>
                        {name} <br /> Start Point
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
