import { MetadataRoute } from 'next';
import { getCampsites, getTrails } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://lochnessshores-rebuild.netlify.app';
    const now = new Date();

    const staticPages = [
        { url: baseUrl, lastModified: now, changeFrequency: 'weekly' as const, priority: 1 },
        { url: `${baseUrl}/campsites`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9 },
        { url: `${baseUrl}/trails`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9 },
        { url: `${baseUrl}/extras`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/plan`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    ];

    const campsites = getCampsites();
    const campsitePages = campsites.map(campsite => ({
        url: `${baseUrl}/campsites/${campsite.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const trails = getTrails();
    const trailPages = trails.map(trail => ({
        url: `${baseUrl}/trails/${trail.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...campsitePages, ...trailPages];
}
