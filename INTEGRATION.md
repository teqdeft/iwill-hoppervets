# HopperVets Landing Page — Developer Integration Guide

An affiliate/partner landing page for **HopperVets** members (independent-contractor
veterinarians & vet techs) to claim negotiated member pricing on virtual healthcare,
in partnership with **iWILL 'til I'm Well**.

This guide covers how to connect it to the main site: hosting/routing, the lead form
endpoint, UTM/attribution handling, and the promo code.

---

## 1. Stack & local setup

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (tokens in `src/app/globals.css`)
- **Output:** static export (`output: 'export'` in `next.config.ts`) — builds to a
  static `out/` folder, deployable to any static host or CDN.

```bash
npm install          # restore dependencies (node_modules is NOT in this zip)
npm run dev          # local dev at http://localhost:3000
npm run build        # production static export -> ./out
```

> **Note:** `node_modules/`, `out/`, and `.next/` were intentionally excluded from the
> zip. Run `npm install` to restore dependencies.

---

## 2. Routing / connecting to the main site

The page is a self-contained static export, so there are three common ways to mount it:

| Option | How | Notes |
|---|---|---|
| **Subdomain** | Point e.g. `hoppervets.iwilltilimwell.com` at the `out/` build | Cleanest isolation; set DNS + host the static folder |
| **Subpath** | Serve `out/` behind `https://iwilltilimwell.com/hoppervets/` | Set `basePath: '/hoppervets'` and `assetPrefix` in `next.config.ts`, then rebuild (see below) |
| **Reverse proxy** | Proxy a path on the main site to wherever this is hosted | No rebuild needed; main site's proxy/rewrite rules handle it |

### Subpath rebuild (only if hosting under a path, not a subdomain)

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/hoppervets',        // <-- the path it will live under
  assetPrefix: '/hoppervets',     // <-- so CSS/JS/images resolve correctly
  images: { unoptimized: true },
};
```

Without `basePath`/`assetPrefix`, the export uses **absolute** asset paths (`/_next/...`,
`/images/...`), which resolve correctly from a domain/subdomain root but break under a
subpath. If you see unstyled pages or broken images, this is why.

### Redirects / rerouting
- Internal nav uses in-page anchors (`#features`, `#pricing`, `#faq`, `#claim-form`) —
  no router changes needed.
- All outbound "Claim" CTAs scroll to the `#claim-form` section. There are **no
  external donation or sign-in links** (this is an affiliate page, not a checkout).
- The claim form already registers members on the iWILL app (section 3); the pricing
  "Get Started" buttons scroll to that form.

---

## 3. Registration form — the main integration point

**File:** `src/components/retail/NewsletterForm.tsx`

The form creates a real iWILL 'til I'm Well account. It collects the same fields
the app's own sign-up form requires — **First name, Last name, Email, Mobile phone
(10-digit US), Date of birth (18+), Gender, Password + Confirm password, and
agreement to the Terms & Privacy Policy** — with the **promo code auto-populated and
read-only**.

On submit it `POST`s JSON to **`{APP_URL}/api/register`** (handled by
`App\Http\Controllers\API\RegisterController` in the iWILL app). On success the page
shows an "Account created" confirmation, then sends the member to the app's
**login screen** (`redirect_url` from the API, i.e. `{APP_URL}/login`), where they
sign in with the email and password they just chose and continue to pick a plan.

- **App base URL:** `https://app.iwilltilimwell.com` (live) by default, used for both
  the API and the login redirect. To test against dev, build with
  `NEXT_PUBLIC_IWILL_APP_URL=https://dev.iwilltilimwell.com npm run build`.
- **Errors:** `422` field errors are shown under the matching inputs, `409` means
  the email already has an account (a "Log in" link is shown), `429` is rate
  limiting (10 attempts/minute per IP).
- **Payload:** account fields plus `promo_code` (`HEATHHOPP1`), `landing_page`, and
  any UTM / click-id params. The API stores the promo code and attribution on the
  user as `user_metas` rows with prefix `landing`, and links the user to the
  matching `promocodes` row when `HEATHHOPP1` exists there.

---

## 4. UTM & attribution (already wired)

UTM capture is **built in**. On submit, `NewsletterForm.tsx` reads these params from the
landing URL and forwards them in the registration payload:

```
utm_source  utm_medium  utm_campaign  utm_term  utm_content  gclid  fbclid
```

So a link like:

```
https://hoppervets.iwilltilimwell.com/?utm_source=hoppervets&utm_medium=email&utm_campaign=member_launch
```

results in those values being saved on the new user automatically. To capture
additional params, extend the `UTM_KEYS` array at the top of `NewsletterForm.tsx`.

### Analytics / pixels
No analytics tag is installed yet. Add GA4 / GTM / Meta Pixel in `src/app/layout.tsx`
(use `next/script` with `strategy="afterInteractive"`). A conversion event on successful
registration can be fired in `handleSubmit` where `response.ok` is handled.

---

## 5. Promo code

The code **`HEATHHOPP1`** is defined as a constant and referenced across the page.
To change it, update these spots (search the repo for `HEATHHOPP1`):

- `src/components/retail/NewsletterForm.tsx` — `const PROMO_CODE` (drives the form field)
- `src/components/retail/RetailHero.tsx` — `const PROMO_CODE` (hero callout)
- `src/components/retail/RetailAnnouncementBar.tsx` — top bar text
- `src/components/Features.tsx`, `RetailPricing.tsx`, `RetailFAQ.tsx` — body copy

---

## 6. Branding / content reference

- **Colors:** all brand tokens live in `src/app/globals.css` (`:root`). HopperVets
  palette — charcoal-brown `#3d2f30`, brown/maroon CTA `#6d4142`, cream `#f2ddc6`,
  orange accent `#ff551d`.
- **Logos & images:** `public/images/` — `hoppervets-logo.png` (partner logo, shown on
  a dark chip because the brand logo is cream), `Hero_image.png` (hero), plus the IWTIW
  banner logos.
- **Page sections** (order in `src/app/page.tsx`): Announcement bar → Header → Hero →
  Trust badges → Features → **Claim form** → Pricing → Testimonial → FAQ → Footer.

---

## 7. Pre-launch checklist

- [ ] Choose hosting model (subdomain / subpath / proxy) and set `basePath` if needed
- [ ] Confirm `HEATHHOPP1` exists in the app's `promocodes` table (and in
      `landing_promo_filters` if the plan screen should pre-fill/filter for it)
- [ ] Rebuild (`npm run build`) and upload the new `out/` folder
- [ ] Add analytics/pixel + conversion event
- [ ] Replace placeholder contact details in `RetailFooter.tsx`
      (`support@iwilltilimwell.com`, `1-800-555-0199`) with real ones
- [ ] Verify the testimonial (currently a sample attributed to "Justin Lee") is real or
      replaced
- [ ] Confirm legal links in the footer (`/privacy`, `/terms`, `/insurance-disclaimer`)
      resolve on the chosen host
