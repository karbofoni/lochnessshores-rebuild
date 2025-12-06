import {
    ShowerHead,
    Tent,
    Dog,
    Flame,
    Zap,
    ZapOff,
    Baby,
    Waves,
    Wind,
    Wifi,
    Car,
    Utensils,
    Home,
    HelpCircle
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
    'shower': ShowerHead,
    'showers': ShowerHead,
    'toilets': Home, // Close enough for "Restroom" generic
    'dog': Dog,
    'dog-friendly': Dog,
    'dogs-allowed': Dog,
    'fires-permitted': Flame,
    'campfire': Flame,
    'electric-hookups': Zap,
    'no-electric': ZapOff,
    'family-friendly': Baby,
    'drying-room': Wind,
    'wifi': Wifi,
    'parking': Car,
    'cafe': Utensils,
    'restaurant': Utensils,
    'lochside': Waves,
    'water': Waves,
    'glamping': Home,
    'tent': Tent,
};

export function FacilityIcon({ tag, className }: { tag: string, className?: string }) {
    // Normalize tag to find match
    const normalized = tag.toLowerCase().replace(/s$/, ''); // simple singularization

    // Exact match or partial match
    let IconComponent = ICON_MAP[tag.toLowerCase()];
    if (!IconComponent) {
        const key = Object.keys(ICON_MAP).find(k => tag.toLowerCase().includes(k));
        IconComponent = key ? ICON_MAP[key] : HelpCircle;
    }

    return <IconComponent className={className} />;
}
