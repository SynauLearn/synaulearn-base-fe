import type { MetadataRoute } from "next";

/**
 * Sitemap configuration for search engines
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.synaulearn.com";
    const lastModified = new Date();

    return [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/leaderboard`,
            lastModified,
            changeFrequency: "hourly",
            priority: 0.7,
        },
    ];
}
