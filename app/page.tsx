import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ClientApp from "./ClientApp";

/**
 * Home Page - Server Component
 *
 * This is a Server Component that preloads public data
 * before passing to the client for hydration.
 *
 * Benefits:
 * - Faster initial load (content pre-rendered)
 * - Better SEO (HTML contains actual content)
 * - Reduced client-side data fetching
 * - ISR caching - page revalidates every 60 seconds
 */

// Enable ISR - page will be cached and revalidated every 60 seconds
// This dramatically reduces TTFB for repeated requests
export const revalidate = 60;

export default async function Home() {
  // Preload public data on server in parallel
  // Data will be hydrated on client and remain reactive via Convex
  const [preloadedCourses, preloadedCategories] = await Promise.all([
    preloadQuery(api.courses.list, {}),
    preloadQuery(api.categories.list, {}),
  ]);

  return (
    <ClientApp
      preloadedCourses={preloadedCourses}
      preloadedCategories={preloadedCategories}
    />
  );
}
