# Fahmida Sultana Naznin — Portfolio

Personal academic and professional portfolio for **Mst. Fahmida Sultana Naznin**, featuring research, projects, awards, career and leadership experience, skills, writing, and media coverage.

**Live website:** [mdsium003.github.io/fahmida_protofolio](https://mdsium003.github.io/fahmida_protofolio/)

The site is a static, client-rendered application built with React and Vite. Most portfolio records are managed in CSV files under `public/data/`; there is no application server or database.

## Site sections

- **Home** — profile, photo wall, news updates, and selected media mentions.
- **Career** — education, employment, volunteering, and leadership experience.
- **Projects** — software and engineering work.
- **Research** — publications, abstracts, authors, and related links.
- **Awards** — honors, competitions, grants, and related media.
- **Skills** — programming and technical skills, languages, and professional training.
- **Blog** — articles, travel stories, vlogs, and media mentions.

## Technology

- React 19 and React Router 7
- Vite 7
- Motion for interactive transitions
- PapaParse for CSV loading
- Lucide React icons
- GitHub Pages for hosting and GitHub Actions for deployment

## Local development

Requirements: Node.js 22 and npm.

```bash
git clone https://github.com/mdsium003/fahmida_protofolio.git
cd fahmida_protofolio
npm ci
npm run dev
```

Open the local URL printed by Vite. Since this is a GitHub Pages project site, the configured base path is `/fahmida_protofolio/`; use that path if the root URL does not load the app.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite with hot module replacement. |
| `npm run validate:data` | Check the configured CSV datasets for parsing and data-integrity problems. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Validate data through the `prebuild` hook and create the production bundle in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run optimize:images` | Generate optimized photo-wall thumbnails under `public/wall/thumbs/`. |

## Editing portfolio content

Edit the relevant CSV under `public/data/`. Keep its header and column order unchanged, use a unique ID within that file, and follow that file’s sort rules. A CSV is displayed only when the application has a loader and page/component connected to it.

Start with:

- [`DATA_MANAGEMENT.md`](DATA_MANAGEMENT.md) — complete authoring guide, field reference, image rules, and display-order behavior.
- [`public/data/README.md`](public/data/README.md) — quick overview of data files.

There are 16 CSV files in the repository. The current validator checks 15; `linkedin_featured.csv` is not yet included in the validator and is not currently connected to a page. `upcycling.csv` also has no connected page, so adding rows to either file alone will not make them appear on the website. See the data guide for details.

### Images and local assets

Place images in `public/images/` or `public/wall/` (or an appropriate subfolder). In CSVs, use site-root paths such as `/images/research/paper-figure.png` or `/wall/travel-photo.jpg`. Do not use a local drive path or hardcode the GitHub Pages prefix. Filenames are case-sensitive on the live host; match capitalization and extension exactly.

## Build and deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow installs dependencies with `npm ci`, runs ESLint, builds the site, and deploys `dist/` to GitHub Pages. The build runs the CSV validator through npm’s `prebuild` lifecycle.

Before pushing a content or code change, run:

```bash
npm run validate:data
npm run lint
npm run build
```

The validator checks CSV parsing, duplicate or missing IDs, configured required fields, and configured boolean/numeric fields. It does not verify image-file paths, external URLs, date formats, or whether a dataset is connected to a page. Preview the changed section locally before publishing.

GitHub Pages must be configured to use **GitHub Actions** as its deployment source. See [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) for setup, deployment monitoring, and troubleshooting.

### GitHub Pages base path

This repository is deployed as a project site at `/fahmida_protofolio/`. The base is set in [`vite.config.js`](vite.config.js) and is shared by Vite, React Router, and [`src/utils/assetUrl.js`](src/utils/assetUrl.js). If the site moves to a custom domain or a user site, update the base path and follow the metadata and DNS checklist in the deployment guide.

### Client-side routing and external resources

GitHub Pages does not provide SPA rewrite rules. The [`public/404.html`](public/404.html) and [`src/spaRestore.js`](src/spaRestore.js) files preserve direct visits and refreshes on application routes.

The Content Security Policy is set in `index.html`. When adding an external font, image, video, or other resource host, update the policy if required; otherwise, the browser may block the resource.

## Repository structure

```text
components/             Shared and section-specific React components
pages/                  Route-level page components
styles/                 Page styles and shared design system
src/                    App entry, router, hooks, CSV and asset utilities
public/data/             CSV content records
public/images/           Portfolio images, logos, and thumbnails
public/wall/             Photo-wall originals and generated thumbnails
public/CV/               CV and related documents
scripts/                 CSV validation and image optimization
.github/workflows/       GitHub Actions deployment workflow
```

## Routes

| Path | Section |
| --- | --- |
| `/` | Home |
| `/career` | Career |
| `/projects` | Projects |
| `/research` | Research |
| `/awards` | Awards |
| `/skills` | Skills |
| `/blog` | Blog |
