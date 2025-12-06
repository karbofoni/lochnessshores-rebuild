import { MetadataRoute } from 'next';
import { getCampsites, getTrails, getExtras, getFAQs } from '@/lib/data';
import { getAllGuideSlugs } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://lochnessshores.com';

    const campsites = getCampsites().map((site) => ({
        url: `${baseUrl}/campsites/${site.slug}`,
        lastModified: new Date(),
    }));

    const trails = getTrails().map((trail) => ({
        url: `${baseUrl}/trails/${trail.slug}`,
        lastModified: new Date(),
    }));

    const extras = getExtras().map((extra) => ({
        url: `${baseUrl}/extras/${extra.slug}`,
        lastModified: new Date(),
    }));

    const faqs = getFAQs().map((faq) => ({
        url: `${baseUrl}/faq/${faq.slug}`,
        lastModified: new Date(),
    }));

    const guides = getAllGuideSlugs().map((g) => ({
        url: `${baseUrl}/guides/${g.params.slug}`,
        lastModified: new Date(),
    }));

    const routes = [
        '',
        '/campsites',
        '/trails',
        '/extras',
        '/guides',
        '/faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
    }));

    return [...routes, ...campsites, ...trails, ...extras, ...faqs, ...guides];
}
