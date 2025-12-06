export interface Campsite {
    id: string;
    slug: string;
    display_name: string;
    short_description: string;
    latitude: number;
    longitude: number;
    area_id: string; // 'north-shore', 'south-shore', 'highlands', 'inverness'
    stay_types: string[]; // e.g., 'tent', 'caravan', 'glamping'
    facility_tags: string[]; // e.g., 'toilets', 'showers', 'dog-friendly'
    min_night_stay: number;
    typical_price_band: 'budget' | 'midrange' | 'premium';
    distance_to_loch_m?: number;
    open_months: string[];
    external_booking_url: string;
    photos: string[];
    last_verified_at?: string;
    has_drying_room?: boolean;
    damp_notes?: string;
    address?: string; // New
    phone?: string;   // New
    email?: string;   // New
}

export interface Trail {
    id: string;
    slug: string;
    name: string;
    distance_km: number;
    difficulty: 'Easy' | 'Moderate' | 'Desperate';
    area_id: string;
    description: string;
    summary?: string; // Add optional summary
    highlights?: string[]; // Add optional highlights
    notes?: string;   // Add optional notes
    start_point_lat: number;
    start_point_lng: number;
    nearby_campsite_ids: string[];
    type?: string;
}

export interface Extra {
    id: string;
    slug: string;
    name: string;
    type: string; // 'pub', 'shop', 'activity'
    category?: string; // Add optional category
    area_id: string;
    description: string;
    summary?: string; // Add optional summary
    latitude?: number;
    longitude?: number;
    website_url?: string;
}

export interface Area {
    id: string;
    name: string;
    description: string;
}

export interface StayType {
    id: string;
    label: string;
}

export interface FacilityTag {
    id: string;
    label: string;
    icon: string;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    related_links?: { text: string; url: string }[];
}
