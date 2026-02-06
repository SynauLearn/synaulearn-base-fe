import type { MetadataRoute } from "next";

/**
 * Robots.txt configuration for search engines
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://synaulearn.space";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/_next/", "/private/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
