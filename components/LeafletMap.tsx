'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Campsite } from '@/lib/types';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
    campsite: Campsite;
}

export default function Map({ campsite }: MapProps) {
    return (
        <MapContainer
            center={[campsite.latitude, campsite.longitude]}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full rounded-xl z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[campsite.latitude, campsite.longitude]} icon={icon}>
                <Popup>
                    <span className="font-bold">{campsite.display_name}</span>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
