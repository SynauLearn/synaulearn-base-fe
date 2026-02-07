/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as badges from "../badges.js";
import type * as cards from "../cards.js";
import type * as categories from "../categories.js";
import type * as courses from "../courses.js";
import type * as lessons from "../lessons.js";
import type * as migrations_regenerateCourseProgress from "../migrations/regenerateCourseProgress.js";
import type * as migrations_schemaMigrations from "../migrations/schemaMigrations.js";
import type * as migrations_seedCards from "../migrations/seedCards.js";
import type * as migrations_seedCardsBatch from "../migrations/seedCardsBatch.js";
import type * as migrations_seedFromSupabase from "../migrations/seedFromSupabase.js";
import type * as migrations_seedProgress from "../migrations/seedProgress.js";
import type * as progress from "../progress.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  badges: typeof badges;
  cards: typeof cards;
  categories: typeof categories;
  courses: typeof courses;
  lessons: typeof lessons;
  "migrations/regenerateCourseProgress": typeof migrations_regenerateCourseProgress;
  "migrations/schemaMigrations": typeof migrations_schemaMigrations;
  "migrations/seedCards": typeof migrations_seedCards;
  "migrations/seedCardsBatch": typeof migrations_seedCardsBatch;
  "migrations/seedFromSupabase": typeof migrations_seedFromSupabase;
  "migrations/seedProgress": typeof migrations_seedProgress;
  progress: typeof progress;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
