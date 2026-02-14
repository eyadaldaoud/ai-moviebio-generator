import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://insta-aibio.vercel.app'; // TODO: Update with your actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
