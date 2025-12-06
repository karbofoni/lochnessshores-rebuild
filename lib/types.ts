export interface Campsite {
    id: string;
    slug: string;
    display_name: string;
    official_name?: string;
    short_description: string;
    latitude: number;
    longitude: number;
    area_id: string;
    stay_types: string[]; // e.g., "lochside-campsite", "glamping-pod"
    facility_tags: string[]; // e.g., "dog-friendly", "family-friendly"
    min_night_stay?: number;
    typical_price_band?: "budget" | "midrange" | "premium";
    has_drying_room?: boolean;
    damp_notes?: string;
    distance_to_loch_m?: number;
    open_months: string[];
    external_booking_url?: string;
    phone?: string;
    email?: string;
    photos: string[];
    last_verified_at?: string;
}

export interface Trail {
    id: string;
    slug: string;
    name: string;
    type: "hiking" | "cycling" | "paddling" | "multi-use";
    summary: string;
    distance_km: number;
    ascent_m?: number;
    difficulty: "easy" | "moderate" | "hard";
    start_lat: number;
    start_lng: number;
    end_lat?: number;
    end_lng?: number;
    circular: boolean;
    area_id: string;
    highlights: string[];
    best_seasons: string[];
    notes: string;
}

export interface Extra {
    id: string;
    slug: string;
    name: string;
    category: "activity" | "rental" | "attraction" | "food-drink" | "shop" | "service";
    summary: string;
    area_id: string;
    latitude?: number;
    longitude?: number;
    website_url?: string;
    phone?: string;
    email?: string;
}

export interface Area {
    id: string;
    slug: string;
    name: string;
    level: "region" | "subregion" | "village";
    parent_id?: string;
    description: string;
}

export interface StayType {
    id: string;
    name: string;
    description: string;
}

export interface FacilityTag {
    id: string;
    label: string;
    group?: string;
}

export interface FAQItem {
    slug: string;
    question: string;
    short_answer: string;
    extended_content: string;
    related_links: { href: string; label: string; }[];
}
