# SEO audit and implementation notes

Audit date: 2026-10-24

## Project shape

- Next.js App Router application with public catalogue, product, category, contact, about and scheme routes.
- Admin pages are under `/admin`; server routes are under `/api`.
- Product records are read from Firestore and product images are served from Cloudinary.
- The public site currently uses a custom admin username/password session rather than Firebase Authentication.

## Existing SEO findings

- The root layout already had basic title, description, keywords and Open Graph metadata.
- Individual public pages had useful titles and descriptions, but canonical URLs were not defined.
- Product metadata did not include product images or structured data.
- There was no sitemap or robots metadata route.
- The home page was entirely client-rendered, which made page-level metadata harder to maintain safely.
- Admin, API and cart routes needed explicit crawl controls.

## Implemented

- Added shared SEO helpers that only emit canonical URLs when `NEXT_PUBLIC_SITE_URL` is a valid HTTPS URL.
- Added page-level canonical metadata for public pages.
- Added `app/sitemap.js` for public routes, Firestore products, and only categories represented by products.
- Added `app/robots.js` to allow public pages and disallow `/admin/`, `/api/` and `/cart`.
- Added no-index metadata for the admin area and cart.
- Added guarded `JewelryStore` JSON-LD using the existing business address and phone details.
- Added guarded `Product` JSON-LD for products with valid prices and images.
- Added safer social metadata using confirmed social URLs already supplied for this project.

## Verification items still requiring the owner

- Set `NEXT_PUBLIC_SITE_URL` in Vercel to the final HTTPS domain after the GoDaddy domain is connected. Until then, canonical links, sitemap URLs and JSON-LD are intentionally omitted.
- Confirm the final business address, phone number and opening hours before publishing them in Google Business Profile or structured data. The current About page says `10:00 AM – 8:30 PM`, while the central config says `10:00 AM – 9:00 PM`, so hours are intentionally not included in JSON-LD.
- Register the final domain in Google Search Console and submit `/sitemap.xml` after DNS and HTTPS are working.
- Firebase Firestore rules should be tightened before production use; the current project rules allow unrestricted reads and writes. This was not changed as part of SEO work.

## Validation

- `npm run build` should be run after these changes.
- `git diff --check` should report no whitespace errors.
- Verify `/robots.txt` and `/sitemap.xml` on the deployed HTTPS domain after `NEXT_PUBLIC_SITE_URL` is configured.
