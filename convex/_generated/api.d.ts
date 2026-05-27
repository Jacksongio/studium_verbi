/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as bibleNotes from "../bibleNotes.js";
import type * as bibleVerses from "../bibleVerses.js";
import type * as chats from "../chats.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as profile from "../profile.js";
import type * as savedVerses from "../savedVerses.js";
import type * as search from "../search.js";
import type * as seed from "../seed.js";
import type * as studyPlanActions from "../studyPlanActions.js";
import type * as studyPlans from "../studyPlans.js";
import type * as userPreferences from "../userPreferences.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  bibleNotes: typeof bibleNotes;
  bibleVerses: typeof bibleVerses;
  chats: typeof chats;
  http: typeof http;
  messages: typeof messages;
  profile: typeof profile;
  savedVerses: typeof savedVerses;
  search: typeof search;
  seed: typeof seed;
  studyPlanActions: typeof studyPlanActions;
  studyPlans: typeof studyPlans;
  userPreferences: typeof userPreferences;
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
