# Mst. Fahmida Sultana Naznin — Portfolio

Personal portfolio site: research publications, projects, career history, recognitions and writing.

**Live:** https://mdsium003.github.io/fahmida_protofolio/

Built with React 19, Vite 7, React Router 7 and Motion. All content is authored in
CSV files under `public/data/` — no CMS, no database, no backend.

---

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Validates every CSV, then builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | ESLint over the whole repo |
| `npm run validate:data` | CSV schema + integrity check (also runs on `prebuild`) |
| `npm run optimize:images` | Regenerates `public/wall/thumbs/` WebP thumbnails |

### Environment variables

**There are none.** The site is fully static and reads its content from the CSVs
in `public/data/`. No `.env` file is needed to build or deploy, which is why the
repo has no `.env.example`. If you ever add one, note that anything prefixed
`VITE_` is **embedded in the public JavaScript bundle** and is not a secret.

---

## Editing content

All content lives in `public/data/*.csv` and can be edited in Excel, Google
Sheets, or any text editor. See [`public/data/README.md`](public/data/README.md)
for the column reference and [`DATA_MANAGEMENT.md`](DATA_MANAGEMENT.md) for the
full authoring guide.

`npm run build` validates every file first, so a malformed CSV fails the build
rather than shipping a broken page.

### Image paths

Write image paths site-root-absolute, e.g. `/images/foo.jpg` or `/wall/(3).jpg`.
They are resolved against the deployment base at runtime — never hardcode
`/fahmida_protofolio/` into a CSV or a component.

---

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which runs `npm ci`, lints, validates the data, builds, and publishes `dist/`
to GitHub Pages.

One-time setup: **Settings → Pages → Source → GitHub Actions**.

### Base path

The site is a GitHub Pages *project* site, so it is served from a sub-path and
`base` is set accordingly in [`vite.config.js`](vite.config.js):

```js
const BASE = '/fahmida_protofolio/';
```

That single value drives Vite's asset rewriting, the React Router `basename`,
and [`src/utils/assetUrl.js`](src/utils/assetUrl.js), which resolves every
runtime path (CSV-supplied images, hardcoded fallbacks, the CV link).

**Moving to a custom domain?** Change `BASE` to `'/'`, add a `public/CNAME`
containing the domain, and update the absolute URLs in `index.html`
(`og:url`, `og:image`, `twitter:image`, `canonical`), `public/robots.txt`,
`public/sitemap.xml`, `public/site.webmanifest` and `public/404.html`.

### SPA routing on GitHub Pages

Pages has no rewrite rules, so a direct hit on `/research` would 404. The
standard shim handles it: [`public/404.html`](public/404.html) encodes the
requested path into a query string and bounces to the app root, and
[`src/spaRestore.js`](src/spaRestore.js) unpacks it before the router mounts.
Genuinely unknown routes land on the in-app 404 page.

### Security headers

GitHub Pages cannot send HTTP response headers, so the Content Security Policy
is delivered via `<meta http-equiv>` in [`index.html`](index.html). Two
consequences are worth knowing:

- `frame-ancestors`, `X-Frame-Options` and `Permissions-Policy` are **ignored**
  in meta form. Clickjacking protection therefore comes from
  [`src/frameGuard.js`](src/frameGuard.js) instead.
- The policy allow-lists only Google Fonts, `www.youtube-nocookie.com` and the
  YouTube thumbnail hosts. **Adding any new external resource requires updating
  the CSP**, or the browser will silently block it.

---

## Project layout

```
components/   feature components, grouped by page area
pages/        one component per route
styles/       one stylesheet per page, plus global.css (design tokens)
src/          entry point, router, CSV loader, path helpers
public/data/  all site content as CSV
public/       images, CV, wall gallery, favicons, robots/sitemap
scripts/      data validation and image optimisation tooling
```
