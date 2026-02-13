# Sanity + Next.js 16 integration

Summary of official docs and current setup.

## Data fetching

- **Client:** Use `createClient` from `next-sanity` in `sanity/lib/client.ts` with `projectId`, `dataset`, `apiVersion`, and `useCdn`.
- **Server:** Fetch in Server Components with `client.fetch()` and optional `next: { revalidate, tags }` for caching.
- **Params:** In App Router, `params` and `searchParams` are **Promises** in Next.js 15+; always `await` them (e.g. `const { slug } = await params`).

See: [Displaying content in Next.js](https://www.sanity.io/docs/next-js-quickstart/diplaying-content-in-next-js), [sanity-nextjs rule](#) (Live Content API, caching, revalidation).

## Embedded Studio (this project)

Studio is embedded at **`/studio`** via `app/studio/[[...tool]]/page.tsx`.

### Next.js 15/16 build fix: client-only Studio

Sanity Studio uses React context and other client-only APIs. During `next build`, “Collecting page data” can run the Studio route on the server and trigger:

`TypeError: (0 , bT.createContext) is not a function`

**Recommended approaches:**

1. **Dynamic import with `ssr: false`** (current in this repo)  
   Load `NextStudio` only on the client so it never runs during build:

   ```tsx
   import nextDynamic from "next/dynamic";
   import config from "../../../sanity.config";

   const NextStudio = nextDynamic(
     () => import("next-sanity/studio").then((mod) => mod.NextStudio),
     { ssr: false }
   );

   export const dynamic = "force-dynamic";
   export { metadata, viewport } from "next-sanity/studio";

   export default function StudioPage() {
     return <NextStudio config={config} />;
   }
   ```

2. **`"use client"` wrapper** (alternative from [next-sanity#2201](https://github.com/sanity-io/next-sanity/issues/2201))  
   Keep the page as a Server Component and render a client component that imports and mounts Studio:

   ```tsx
   // app/studio/[[...tool]]/page.tsx
   import { StudioWrapper } from "./StudioWrapper";

   export const dynamic = "force-dynamic";
   export { metadata, viewport } from "next-sanity/studio";

   export default function StudioPage() {
     return <StudioWrapper />;
   }
   ```

   ```tsx
   // app/studio/[[...tool]]/StudioWrapper.tsx
   "use client";
   import { NextStudio } from "next-sanity/studio";
   import config from "../../../sanity.config";

   export function StudioWrapper() {
     return <NextStudio config={config} />;
   }
   ```

Use **`force-dynamic`** for the Studio route so it is not statically generated at build time.

## Visual editing & draft mode

- **Draft mode:** API route using `defineEnableDraftMode` from `next-sanity/draft-mode` (e.g. `/api/draft-mode/enable`).
- **Visual editing:** Render `<VisualEditing />` from `next-sanity/visual-editing` only when draft mode is enabled (e.g. in root layout, conditional on `(await draftMode()).isEnabled`).
- **Embedded studio:** Do **not** render `VisualEditing` (or `SanityLive`) in a layout that wraps the Studio route. Use route groups so the main app layout has Visual Editing and the Studio route has its own layout without it.

See: [Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router).

## Live Content API (optional)

For real-time updates and best experience with Presentation tool:

- Use `defineLive` from `next-sanity/live` with `client`, `serverToken`, and `browserToken`.
- Render `<SanityLive />` in the root layout (and **not** in the Studio layout).
- Use `sanityFetch` from `defineLive` instead of `client.fetch` where you want live updates.

See: sanity-nextjs rule and [Live Content API](https://www.sanity.io/docs/developer-guides/live-content-guide).

## CORS

Add the URL where the app (and Studio) run to your Sanity project’s **CORS origins** (e.g. `http://localhost:3000`, production domain), with **authenticated requests** enabled.

## References

- [Sanity: Displaying content in Next.js](https://www.sanity.io/docs/next-js-quickstart/diplaying-content-in-next-js)
- [Sanity: Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router)
- [Sanity: Embedding Sanity Studio](https://www.sanity.io/docs/studio/embedding-sanity-studio)
- [next-sanity README](https://github.com/sanity-io/next-sanity) (Embedded Sanity Studio, Live Content API)
- [next-sanity#2201](https://github.com/sanity-io/next-sanity/issues/2201) – `createContext` build error and fix
- Next.js 16: [Upgrading to version 16](https://nextjs.org/docs/app/building-your-application/upgrading/version-16) (async APIs, Turbopack, etc.)
