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
 */
export default async function Home() {
  // Preload public data on server
  // These will be hydrated on client and remain reactive
  const preloadedCourses = await preloadQuery(api.courses.list, {});
  const preloadedCategories = await preloadQuery(api.categories.list, {});

  return (
    <ClientApp
      preloadedCourses={preloadedCourses}
      preloadedCategories={preloadedCategories}
    />
  );
}
