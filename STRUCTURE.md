# Portfolio Architecture & Codebase Structure Guide

> **Project:** Mst. Fahmida Sultana Naznin — Academic & Professional Portfolio  
> **Repository:** `mdsium003/fahmida_protofolio`  
> **Live Site:** [https://mdsium003.github.io/fahmida_protofolio/](https://mdsium003.github.io/fahmida_protofolio/)  
> **Stack:** React 19 · Vite 7 · React Router 7 · Motion (Framer Motion) · PapaParse · Lucide React · Vanilla CSS Tokens

---

## 1. Executive Summary & Architectural Philosophy

This portfolio is engineered as an **ultra-fast, 100% static, client-side Single Page Application (SPA)** that runs with **zero database, zero CMS, and zero server backend**.

### Key Architectural Pillars
1. **Decoupled Data Architecture:** All dynamic content (projects, research papers, awards, blogs, skills, career history, media mentions, photos, and social links) is stored in standard CSV files located in `public/data/`. React components contain zero hardcoded content.
2. **In-Memory Normalization Layer:** The `src/utils/csvLoader.js` utility fetches CSVs asynchronously at runtime via `PapaParse`, caches them in memory, parses compound syntax fields (links, media, authors, tags), and delivers clean, type-safe JavaScript objects to UI components.
3. **Sub-Path Base Routing & Static SPA Fallback:** Designed for GitHub Pages project hosting (`/fahmida_protofolio/`), with an automated path-resolution utility (`src/utils/assetUrl.js`) and a two-stage 404 query-bounce mechanism (`public/404.html` + `src/spaRestore.js`) allowing direct deep-linking on static servers.
4. **Pre-Build Validation Gatekeeper:** A dedicated Node.js validator (`scripts/validateData.js`) runs prior to every production build (`prebuild` hook), validating all 14 CSV files for schema correctness, missing required fields, and duplicate IDs.
5. **Zero-Dependency Styling System:** Styled using modular Vanilla CSS driven by a centralized design token system (`styles/global.css`) without heavyweight utility frameworks like Tailwind.

```
                    ┌───────────────────────────────────────────┐
                    │       CSV Data Files (public/data/)       │
                    │   projects, research, awards, blogs, etc. │
                    └─────────────────────┬─────────────────────┘
                                          │  Fetch & Parse
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │    CSV Loader (src/utils/csvLoader.js)    │
                    │   • In-memory caching (Map)               │
                    │   • Compound string parser (links/media)  │
                    │   • Boolean/Number normalization          │
                    │   • Automatic image path resolution       │
                    │   • Dynamic BibTeX generator              │
                    └─────────────────────┬─────────────────────┘
                                          │  Normalized Objects
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │      React 19 Pages & UI Components       │
                    │  Homepage, Projects, Research, Awards,    │
                    │  Career, Skills, Blog, Modals, Carousels  │
                    └───────────────────────────────────────────┘
```

---

## 2. Complete Directory Tree & File Inventory

```
fahmida_protofolio/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD deployment workflow
│
├── public/                         # Static assets served as-is by Vite
│   ├── 404.html                    # GitHub Pages SPA deep-link query bounce shim
│   ├── favicon.svg                 # SVG browser favicon
│   ├── og-image.png                # Open Graph preview card for social sharing
│   ├── robots.txt                  # Search engine crawler instructions
│   ├── site.webmanifest            # Progressive Web App manifest
│   ├── sitemap.xml                 # Search engine XML sitemap
│   ├── spa-redirect.js             # Fallback script for SPA redirect
│   ├── CV/                         # Downloadable Curriculum Vitae / Resume PDFs
│   ├── Icon/                       # Custom brand & specialty icons
│   ├── images/                     # Primary portfolio images (portraits, logos, figures)
│   ├── wall/                       # Photo wall gallery & moments snapshots
│   │   └── thumbs/                 # Optimized WebP gallery thumbnails
│   └── data/                       # 14 CSV files powering 100% of site content
│       ├── awards.csv              # Honors, competitions, fellowships, grants
│       ├── blogs.csv               # Articles, stories, and video vlogs
│       ├── education.csv           # Academic degrees, universities, GPAs
│       ├── experience.csv          # Academic & industry work history
│       ├── leadership.csv          # Community leadership & organizational roles
│       ├── media_mentions.csv      # TV interviews, press, newspaper features
│       ├── moments.csv             # Photo moments displayed on Homepage & Blog
│       ├── news.csv                # Latest announcements & monthly news items
│       ├── projects.csv            # Engineering & software projects
│       ├── research.csv            # Academic papers, publications, preprints
│       ├── skills.csv              # Domains, languages, frameworks, tools
│       ├── social_links.csv        # Profile links (GitHub, LinkedIn, FB, CV)
│       ├── upcycling.csv           # DIY & sustainability craft projects
│       ├── volunteer.csv           # Community service & non-profit involvement
│       └── README.md               # Quick CSV data overview
│
├── pages/                          # Primary view components (1 per route)
│   ├── Homepage.jsx                # Landing page (Bento hero, 3D wall, spotlights)
│   ├── ProjectsPage.jsx            # Filterable projects grid, search & deep-link modal
│   ├── ResearchPage.jsx            # Research papers, Bento spotlight, BibTeX modal
│   ├── AwardsPage.jsx              # Honors & awards marquee, category filters, modals
│   ├── CareerPage.jsx              # Unified career hub (Experience, Education, Volunteer)
│   ├── SkillsPage.jsx              # Domain specialization breakdown & tech stack pills
│   ├── BlogPage.jsx                # Article reader, video vlog strip, key moments
│   └── NotFoundPage.jsx            # Designed 404 error page with navigation options
│
├── components/                     # Modular UI components grouped by feature area
│   ├── shared/                     # Global reusable components
│   │   ├── Layout.jsx              # Main shell (Header, Navigation, Mobile Drawer, Footer)
│   │   ├── ScrollToTop.jsx         # Window scroll reset on route navigation
│   │   ├── ScrollReveal.jsx        # Motion scroll-in viewport animation wrapper
│   │   ├── StaggerReveal.jsx       # Cascading child animation wrapper
│   │   ├── DriftWall.jsx           # Interactive, physics-inspired drifting photo gallery
│   │   ├── DriftWall.css           # DriftWall layout & animation styles
│   │   ├── PortfolioPreloader.jsx  # Initial loading screen animation
│   │   └── LoadingState.jsx        # Skeleton / spinner placeholder for data loading
│   ├── home/                       # Homepage-specific feature sections
│   │   ├── HomePositioning.jsx     # Executive positioning & bio statement
│   │   ├── HomeResearchSpotlight.jsx # Featured research papers Bento showcase
│   │   ├── HomeRecognitionPreview.jsx# High-profile awards marquee showcase
│   │   ├── HomeNews.jsx            # Latest news, announcements & updates section
│   │   ├── HomeMentionsPreview.jsx # TV interviews, press & newspaper clipping cards
│   │   └── HomeContactCTA.jsx      # Bottom contact invitation banner
│   ├── projects/                   # Projects page components
│   │   ├── ProjectsHero.jsx        # Projects page introduction & stats header
│   │   ├── FeaturedProjectHero.jsx # Featured flagship project highlight banner
│   │   ├── ProjectBentoGrid.jsx    # Responsive grid container for project cards
│   │   ├── ProjectCard.jsx         # Individual project preview card
│   │   ├── ProjectDetailModal.jsx  # Deep-linked full-screen detail popup modal
│   │   ├── ProjectFilters.jsx      # Category tab selector & keyword search bar
│   │   └── ProjectGraphicFallback.jsx# SVG fallback generator when images are missing
│   ├── research/                   # Research publications & paper components
│   ├── awards/                     # Honors, awards & certificate viewer components
│   ├── skills/                     # Domain cards & technology stack components
│   └── blog/                       # Blog cards, vlog player & moments strip components
│
├── styles/                         # CSS stylesheets (1 per page + design system)
│   ├── global.css                  # Design tokens, variables, typography, reset, scrollbars
│   ├── Homepage.css                # Hero, Bento, 3D Wall & home section styles
│   ├── ProjectsPage.css            # Project grid, filtering, card & modal styles
│   ├── ResearchPage.css            # Paper cards, Bento spotlight, BibTeX styles
│   ├── AwardsPage.css              # Awards marquee, category badges & modal styles
│   ├── CareerPage.css              # Timeline, experience, education & leadership styles
│   ├── SkillsPage.css              # Domain cards, proficiency meters & tool pills styles
│   ├── BlogPage.css                # Blog cards, vlog strip, moments & reader styles
│   ├── NotFoundPage.css            # 404 page aesthetic styling
│   ├── PortfolioPreloader.css      # Preloader splash animation styles
│   └── LoadingState.css            # Loading skeleton styles
│
├── src/                            # Application core & utilities
│   ├── App.jsx                     # Root component, code-splitting router & motion config
│   ├── main.jsx                    # React 19 entry point & DOM mount
│   ├── frameGuard.js               # Anti-clickjacking iframe protection
│   ├── spaRestore.js               # SPA query string restore helper for GitHub Pages
│   ├── hooks/                      # Custom React hooks
│   │   ├── usePageMeta.js          # Dynamic document title & OpenGraph metadata manager
│   │   └── useMenuDialog.js        # Mobile drawer dialog state & keyboard accessibility
│   └── utils/                      # Core business logic & data helpers
│       ├── assetUrl.js             # Deployment base path resolver (`asset('/path')`)
│       └── csvLoader.js            # Universal CSV loader, in-memory cache & parsers
│
├── scripts/                        # Build & maintenance automation scripts
│   ├── validateData.js             # Automated CSV schema & integrity validator
│   ├── optimizeImages.js           # Sharp-based image optimization & WebP generator
│   ├── update_all_cv_data.js       # Synchronizes and normalizes resume data
│   ├── update_research_csv.cjs     # Research data synchronization helper
│   ├── parse_scraped_linkedin.cjs  # LinkedIn profile parser helper
│   └── download_scraped_images.cjs # Image asset scraper helper
│
├── dist/                           # Generated production bundle (after running `npm run build`)
├── eslint.config.js                # Flat ESLint configuration rules
├── index.html                      # HTML entry point, SEO meta, CSP & Google Fonts
├── package.json                    # Project dependencies, metadata & execution scripts
├── package-lock.json               # Deterministic dependency lockfile
└── vite.config.js                  # Vite configuration, sub-path base, Rollup code splitting
```

---

## 3. Application Routing & Page Architecture

Routing is managed by **React Router 7** inside [`src/App.jsx`](file:///d:/Git/Temp_fahmida/fahmida_protofolio/src/App.jsx).

### Route Table

| URL Path | Component | Layout Wrapper | Description |
|---|---|---|---|
| `/` | `pages/Homepage.jsx` | Self-contained | Landing page with Hero, 3D DriftWall, Bento Spotlights, News, and CTAs. |
| `/projects` | `pages/ProjectsPage.jsx` | `components/shared/Layout` | Filterable project showcase with search, category tabs, and modal details (`?id=X`). |
| `/research` | `pages/ResearchPage.jsx` | `components/shared/Layout` | Academic papers, preprints, BibTeX citation generation, and spotlight cards. |
| `/awards` | `pages/AwardsPage.jsx` | `components/shared/Layout` | Honors, grants, global competitions, certificates, and trophy gallery. |
| `/career` | `pages/CareerPage.jsx` | `components/shared/Layout` | Unified career journey: Experience, Education, Volunteering, and Leadership. |
| `/skills` | `pages/SkillsPage.jsx` | `components/shared/Layout` | Domain specializations, technical skills, framework tags, and tool pills. |
| `/blog` | `pages/BlogPage.jsx` | `components/shared/Layout` | Articles, vlog video strip, and photo moments gallery. |
| `/education` | — | Redirect | Bounces automatically to `/career` (`replace` redirect). |
| `/experience` | — | Redirect | Bounces automatically to `/career` (`replace` redirect). |
| `/volunteer` | — | Redirect | Bounces automatically to `/career` (`replace` redirect). |
| `*` | `pages/NotFoundPage.jsx` | `components/shared/Layout` | Catches all unknown routes and renders a custom 404 screen. |

### Routing Optimizations
- **Route-Based Code Splitting:** Every page is dynamically loaded via `React.lazy()` and wrapped in a `<Suspense fallback={<PageLoader />}>` boundary. Users only download the JavaScript bundle for the page they are actively viewing.
- **Scroll Restoration:** The `<ScrollToTop />` component resets window scroll position to `(0, 0)` on every route transition.
- **Accessible Motion:** The entire application is wrapped in `<MotionConfig reducedMotion="user">`, ensuring all Framer Motion animations automatically honor the operating system's "Reduce Motion" accessibility preference.

---

## 4. The Data Engine: `csvLoader.js` & `assetUrl.js`

### 1. `src/utils/csvLoader.js`
The central nervous system of the portfolio. It performs:
- **Asynchronous Fetching & Parsing:** Fetches CSV files from `/data/<filename>.csv` using `fetch()` and parses them via `PapaParse` with `dynamicTyping: true` (auto-parsing numbers and booleans).
- **In-Memory Caching:** Stores parsed datasets in an ES6 `Map`. Navigating between pages never triggers duplicate HTTP requests.
- **Micro-Syntax Parsing:**
  - `parseSources(str)` & `parseLinks(str)`: Converts `type:url|Label ; type:url` into `[{ id, type, label, url }]`.
  - `parseAuthors(str)`: Converts `Name|GitHub|Website ; Name` into `[{ id, name, isMe, github_url, website }]`. Automatically identifies when Fahmida is the author and applies highlight styling.
  - `parseMedia(str)`: Converts `image:url|Caption ; youtube:url` into `[{ id, media_type, media_url, caption }]`.
  - `parseList(str)`: Splits comma/semicolon-separated tags into clean string arrays.
  - `generateBibtex(pub)`: Dynamically generates BibTeX academic citations on the fly when not explicitly provided.
- **Domain Data Loaders:** Specialized loaders for each data type (`loadProjectsData()`, `loadResearchData()`, `loadAwardsData()`, etc.) that normalize data shapes, sort by `is_featured` and `featured_order`, and resolve asset paths.

### 2. `src/utils/assetUrl.js`
Solves the sub-path deployment challenge on GitHub Pages (`https://<user>.github.io/fahmida_protofolio/`):
- Exports `asset(path)`: Automatically prefixes any relative asset path with Vite's `import.meta.env.BASE_URL` (`/fahmida_protofolio/`).
- Safely ignores external URLs (`https://...`), protocol-relative URLs (`//...`), and `data:` URIs.
- Strips redundant prefixes like `public/` or leading `./`.

---

## 5. Design System & CSS Token Architecture

All styling is managed in [`styles/global.css`](file:///d:/Git/Temp_fahmida/fahmida_protofolio/styles/global.css) using CSS Custom Properties (Variables):

### Color Palette Tokens
| CSS Variable | Hex Value | Purpose |
|---|---|---|
| `--color-bg` | `#181614` | Primary deep dark canvas background |
| `--color-surface` | `#23201C` | Card and panel surface background |
| `--color-surface-hover` | `#2D2924` | Interactive hover state for cards |
| `--color-accent` | `#B1CC74` | Signature vibrant matcha/olive accent |
| `--color-accent-dim` | `rgba(177, 204, 116, 0.15)` | Subtle accent backgrounds, badges, and glows |
| `--color-text` | `#F5F3EF` | Primary crisp white text |
| `--color-text-muted` | `#9E988F` | Secondary body text and captions |
| `--color-border` | `rgba(255, 255, 255, 0.08)` | Ultra-fine subtle glass borders |

### Typography Tokens
- **Display / Heading Font:** `'Outfit', sans-serif` (Google Fonts) — Modern, clean, geometric.
- **Body Font:** `'Inter', sans-serif` (Google Fonts) — High legibility for long-form reading.
- **Monospace Font:** `'JetBrains Mono', monospace` — Code snippets, tags, dates, and metrics.

---

## 6. GitHub Pages SPA Routing Mechanism

GitHub Pages does not natively support HTML5 pushState client-side routing. If a user refreshes `/research` directly, GitHub Pages would return a 404 error. This repository uses a battle-tested shim:

```
1. User visits /fahmida_protofolio/research directly
                             │
                             ▼
2. GitHub Pages serves public/404.html (HTTP 404)
                             │
                             ▼
3. 404.html encodes path into query parameter:
   /fahmida_protofolio/?p=/research&q=...
   and redirects to /fahmida_protofolio/
                             │
                             ▼
4. index.html loads -> src/spaRestore.js executes before React mounts
                             │
                             ▼
5. spaRestore.js decodes "?p=/research" and updates window.history
                             │
                             ▼
6. React Router mounts with clean URL: /fahmida_protofolio/research
```

---

## 7. Security & Frame Protection Architecture

1. **Content Security Policy (CSP):** Delivered via `<meta http-equiv="Content-Security-Policy">` in `index.html`. It strictly allow-lists Google Fonts, YouTube iframe embeds (`www.youtube-nocookie.com`), and YouTube thumbnail domains.
2. **Anti-Clickjacking Frame Guard (`src/frameGuard.js`):** Since GitHub Pages cannot emit HTTP response headers (`X-Frame-Options` / `frame-ancestors`), `src/frameGuard.js` verifies if `window.self === window.top`. If framed maliciously, it automatically breaks out to `window.top.location`.

---

## 8. Development & Build Scripts

| Command | Action / Behavior |
|---|---|
| `npm run dev` | Starts Vite local development server with Hot Module Replacement (HMR) at `http://localhost:5173/fahmida_protofolio/`. |
| `npm run build` | First runs `prebuild` (`scripts/validateData.js`), then runs `vite build` to compile the optimized production bundle into `dist/`. |
| `npm run preview` | Locally serves the production `dist/` bundle to test performance and routing before deployment. |
| `npm run lint` | Executes ESLint 9 across all `.js` and `.jsx` files to enforce clean code and prevent regressions. |
| `npm run validate:data` | Runs the standalone CSV validation suite to check schema and ID integrity across all 14 datasets. |
| `npm run optimize:images` | Processes photos in `public/wall/` to generate optimized WebP thumbnails in `public/wall/thumbs/`. |
