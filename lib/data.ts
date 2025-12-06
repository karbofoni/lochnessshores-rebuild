import fs from 'fs';
import path from 'path';
import { Campsite, Trail, Extra, Area, FAQItem, StayType, FacilityTag } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJsonFile<T>(filename: string): T[] {
    const filePath = path.join(DATA_DIR, filename);
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

export const getCampsites = (): Campsite[] => readJsonFile<Campsite>('campsites.json');
export const getTrails = (): Trail[] => readJsonFile<Trail>('trails.json');
export const getExtras = (): Extra[] => readJsonFile<Extra>('extras.json');
export const getAreas = (): Area[] => readJsonFile<Area>('areas.json');
export const getStayTypes = (): StayType[] => readJsonFile<StayType>('stay_types.json');
export const getFacilityTags = (): FacilityTag[] => readJsonFile<FacilityTag>('facility_tags.json');
export const getFAQs = (): FAQItem[] => readJsonFile<FAQItem>('faq.json');

export const getCampsiteBySlug = (slug: string): Campsite | undefined => {
    return getCampsites().find(c => c.slug === slug);
};

export const getTrailBySlug = (slug: string): Trail | undefined => {
    return getTrails().find(t => t.slug === slug);
};

export const getAreaById = (id: string): Area | undefined => {
    return getAreas().find(a => a.id === id);
};
