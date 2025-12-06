import { Metadata } from 'next';
import { getCampsites } from '@/lib/data';

export const metadata: Metadata = {
    title: 'Sitemap | Loch Ness Camping',
    description: 'Sitemap for lochnessshores.com',
};

const URL = 'https://lochnessshores.com';

export default async function sitemap() {
    const campsites = getCampsites();

    const routes = [
        '',
        '/campsites',
        '/trails',
        '/extras',
        '/guides',
        '/faq',
    ].map((route) => ({
        url: `${URL}${route}`,
        lastModified: new Date().toISOString(),
    }));

    const campsiteRoutes = campsites.map((site) => ({
        url: `${URL}/campsites/${site.slug}`,
        lastModified: new Date().toISOString(),
    }));

    // Would add trails/extras here too in full ver

    return [...routes, ...campsiteRoutes];
}
