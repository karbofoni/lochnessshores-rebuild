import { Campsite, Trail, Extra, Area, FAQItem, StayType, FacilityTag } from './types';

// Static imports ensure data is bundled by Webpack/Next.js
// This avoids runtime FS issues in serverless environments
import campsitesData from '../data/campsites.json';
import trailsData from '../data/trails.json';
import extrasData from '../data/extras.json';
import areasData from '../data/areas.json';
import stayTypesData from '../data/stay_types.json';
import facilityTagsData from '../data/facility_tags.json';
import faqData from '../data/faq.json';

export const getCampsites = (): Campsite[] => campsitesData as Campsite[];
export const getTrails = (): Trail[] => trailsData as Trail[];
export const getExtras = (): Extra[] => extrasData as Extra[];
export const getAreas = (): Area[] => areasData as Area[];
export const getStayTypes = (): StayType[] => stayTypesData as StayType[];
export const getFacilityTags = (): FacilityTag[] => facilityTagsData as FacilityTag[];
export const getFAQs = (): FAQItem[] => faqData as FAQItem[];

export const getCampsiteBySlug = (slug: string): Campsite | undefined => {
    return getCampsites().find(c => c.slug === slug);
};

export const getTrailBySlug = (slug: string): Trail | undefined => {
    return getTrails().find(t => t.slug === slug);
};

export const getAreaById = (id: string): Area | undefined => {
    return getAreas().find(a => a.id === id);
};
