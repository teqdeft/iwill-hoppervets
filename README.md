# iWILL 'til I'm Well × JILL Foundation — Landing Page

Landing page for the iWILL 'til I'm Well partnership with the JILL Foundation
(Journey In Life and Living Foundation): mental healthcare, medical care, and
resilience support. Built with Next.js (App Router) + Tailwind CSS and deployed
as a static export.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the page.

## Build

```bash
npm run build
```

`next.config.ts` uses `output: 'export'`, so the build emits a static site to
`out/`. Vercel builds and serves this automatically on deploy.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Page sections live in `src/components/` (the `retail/` folder holds the
  partnership page sections); the page is composed in `src/app/page.tsx`.
