# Portfolio Data Management & Architecture Guide

> [!IMPORTANT]
> **PORTFOLIO CONTENT IS 100% DATA-DRIVEN WITHOUT A DATABASE.**
> 
> All portfolio content (projects, research publications, awards, blog posts, skills, career history, social links, moments) is driven by CSV files located in `public/data/`.
> 
> **For normal content additions, edits, or removals, DO NOT edit JSX/TSX components.** Simply edit the appropriate CSV file, validate, test, and push.

---

## 1. Architecture Overview

The portfolio uses a deterministic, Git-versioned static data architecture:

```
CSV DATA FILES (public/data/*.csv)
       │
       ▼
CENTRAL DATA LOADER & NORMALIZATION LAYER (src/utils/csvLoader.js)
  - Fetches CSV via PapaParse with in-memory caching
  - Normalizes booleans ('true' -> true), numbers, strings
  - Parses complex compound fields (sources, links, authors, media, tags)
  - Sorts dynamically by featured status, priority, and date
  - Validates integrity in development mode
       │
       ▼
NORMALIZED DOMAIN DATA OBJECTS
       │
       ▼
PAGES & UI COMPONENTS
  - Pages consume clean, normalized JavaScript objects
  - Generic detail modals and cards render dynamically
  - Zero hardcoded content, zero array-index coupling
```

---

## 2. Source of Truth Reference

Every page and component in the portfolio derives its content directly from a designated CSV file in `public/data/`:

| Data Entity | Primary Source File | Primary Page / Component |
|---|---|---|
| **Projects** | `public/data/projects.csv` | `pages/ProjectsPage.jsx`, `HomeSelectedProjects.jsx`, `SkillsInPractice.jsx` |
| **Research Publications** | `public/data/research.csv` | `pages/ResearchPage.jsx`, `HomeResearchSpotlight.jsx`, `SkillsInPractice.jsx` |
| **Awards & Honors** | `public/data/awards.csv` | `pages/AwardsPage.jsx`, `HomeRecognitionPreview.jsx`, `FeaturedAwards.jsx` |
| **Blog & Vlogs** | `public/data/blogs.csv` | `pages/BlogPage.jsx`, `HomeJournalPreview.jsx`, `VlogStrip.jsx` |
| **Technical Skills** | `public/data/skills.csv` | `pages/SkillsPage.jsx`, `CoreExpertise.jsx`, `TechnologyStack.jsx` |
| **Career — Experience** | `public/data/experience.csv` | `pages/CareerPage.jsx` (Experience timeline) |
| **Career — Education** | `public/data/education.csv` | `pages/CareerPage.jsx` (Education timeline) |
| **Career — Volunteer** | `public/data/volunteer.csv` | `pages/CareerPage.jsx` (Volunteer & leadership section) |
| **Moments & Wall Media** | `public/data/moments.csv` | `components/blog/MomentsStrip.jsx`, `DriftWall` on `pages/Homepage.jsx` |
| **Social Links & CV** | `public/data/social_links.csv` | Header & Footer social navigation, CV download buttons |

---

## 3. Adding a New Project

To add a new project to the portfolio:

1. Open `public/data/projects.csv` in your editor or spreadsheet program.
2. Add a new row with a unique integer or string `id` (e.g. `16`).
3. Fill in the required and optional fields:
   - `id`: Unique identifier (e.g., `16`).
   - `title`: Name of the project (e.g., `Multimodal Autonomous Drone`).
   - `thumbnail_url`: Image path (e.g., `/wall/drone_demo.jpg` or HTTPS URL).
   - `description`: 1-3 sentence summary of the project.
   - `presented_in`: Presentation venue or context (e.g., `Robotics Hackathon 2026`).
   - `presented_in_url`: Link to venue or event.
   - `year`: Numeric year (e.g., `2026`).
   - `keywords`: Comma-delimited list of technologies (e.g., `ROS2, Computer Vision, PyTorch, C++`).
   - `is_featured`: Set to `true` to feature on the homepage, or `false` to keep in the archive.
   - `featured_order`: Order among featured items (e.g., `1`, `2`, `3`). Leave empty if not featured.
   - `sources`: Semicolon-delimited compound links (e.g., `github:https://github.com/...|Code Repo ; video:https://youtu.be/...|Demo Clip`).
4. Save the file.
5. Run `npm run validate:data` to verify data schema and ID uniqueness.
6. Check `npm run dev` in your browser. The new project will appear automatically with filtering, modal popups, and deep links (`/projects?id=16`) without writing a single line of React code!

---

## 4. Adding a New Research Publication

To add a publication to the Research page:

1. Open `public/data/research.csv`.
2. Add a new row with a unique `id` (e.g., `13`).
3. Fill in the fields:
   - `id`: Unique identifier (e.g., `13`).
   - `title`: Paper title.
   - `publication`: Venue / Journal / Conference (e.g., `IEEE Transactions on Medical Imaging`).
   - `date`: Publication date (e.g., `2026-03-15`).
   - `status`: Status string (e.g., `Published`, `Under Review`, `Preprint`).
   - `topics`: Comma-separated list of topics/disciplines (e.g., `Medical AI, Multimodal Reasoning, Computer Vision`).
   - `authors`: Semicolon-delimited list with optional links (e.g., `Fahmida Hossain|https://github.com/... ; Dr. Jane Doe`).
   - `links`: Semicolon-delimited links (e.g., `paper:https://arxiv.org/abs/...|ArXiv Paper ; code:https://github.com/...|Source Code`).
   - `media`: Image or video demo links (e.g., `image:/wall/research_new.jpg|Architecture Diagram`).
   - `thumbnail_url`: Primary paper teaser image.
   - `year`: Publication year (e.g., `2026`).
   - `is_featured`: `true` to feature in the Bento spotlight on the Homepage and Research page.
   - `featured_order`: Integer rank for the spotlight layout.
4. Save and run `npm run validate:data`.

---

## 5. Adding an Award or Honor

1. Open `public/data/awards.csv`.
2. Add a row with:
   - `id`: Unique identifier (e.g., `57`).
   - `title`: Title of the award or honor.
   - `organization`: Granting body (e.g., `NASA / BASIS`).
   - `date`: Date or year (e.g., `2026`).
   - `category`: Category string (e.g., `Global`, `National`, `Academic`, `Fellowship`).
   - `description`: Detailed paragraph on the recognition.
   - `significance`: Key achievement metric or rank.
   - `media`: Optional image link (e.g., `image:/wall/award_trophy.jpg|Award Certificate`).
   - `is_featured`: `true` to show in the high-profile awards marquee.
   - `featured_order`: Order among featured awards (`1` to `10`).
   - `year`: Numeric year.
3. Save and validate (`npm run validate:data`).

---

## 6. Adding a Blog Post or Vlog Entry

1. Open `public/data/blogs.csv`.
2. Add a row with:
   - `id`: Unique identifier (e.g., `11`).
   - `title`: Article or vlog title (include `[VLOG]` in title or video in media for vlog styling).
   - `published_date`: ISO date `YYYY-MM-DD`.
   - `category`: Category tag (e.g., `AI & Research`, `Career`, `Reflection`, `Tech Vlog`).
   - `reading_time`: Reading time string (e.g., `5 min read` or `12 min watch`).
   - `summary`: Short excerpt for cards.
   - `content_html`: Markdown or HTML formatted content for the detail reader.
   - `thumbnail_url`: Teaser image path.
   - `media`: YouTube URL or gallery images (e.g., `youtube:https://youtu.be/...`).
   - `links`: External reference links.
   - `is_featured`: `true` to feature in the Journal spotlight.
   - `featured_order`: Featured ranking order.

---

## 7. Adding a Skill or Specialization Domain

1. Open `public/data/skills.csv`.
2. To add a **Domain Specialization Card** (displayed in Core Expertise):
   - `id`: Unique ID (e.g., `dom_6`).
   - `category`: Must be `Domains`.
   - `subcategory`: Domain title (e.g., `Quantum Machine Learning`).
   - `name`: Domain title.
   - `proficiency`: Scope string (e.g., `Qubits · Quantum Circuits · Hybrid AI`).
   - `is_primary`: `true`.
   - `icon`: Lucide icon name (e.g., `Brain`, `Eye`, `Box`, `Cpu`, `Server`, `Globe`, `Database`).
   - `display_order`: Position number.
   - `tags`: Comma-separated list of child branching technologies (e.g., `Qiskit, Cirq, PennyLane, Python`).
3. To add a **Technology / Tool / Framework Pill**:
   - `id`: Unique ID (e.g., `frame_10` or `tool_10`).
   - `category`: `Languages`, `Frameworks`, or `Tools`.
   - `subcategory`: Clustering category name (e.g., `PROGRAMMING LANGUAGES`, `AI & MACHINE LEARNING`, `COMPUTER VISION & GRAPHICS`, `3D ENGINES & SPATIAL TOOLS`, `WEB, CLOUD & EMBEDDED`).
   - `name`: Name of tool (e.g., `Rust`, `Next.js`, `Docker`).
   - `proficiency`: Optional rating or description.
   - `is_primary`: `true` (highlighted pill) or `false` (standard pill).
   - `icon`: Icon identifier.
   - `display_order`: Display sequence.
   - `tags`: Leave empty (`""`).

---

## 8. Adding Career Entries

### Education (`public/data/education.csv`)
- `id`: Unique ID.
- `institution`: School, College, or University name.
- `degree_level`: Level (`University`, `College`, `School`, `Online`).
- `field_of_study`: Major or concentration (e.g., `Computer Science and Engineering`).
- `start_year` / `end_year`: Numeric years (e.g., `2022` / `2026`).
- `grade`: GPA, CGPA, or honors description.
- `activities`: Multi-line text of activities, societies, and key achievements.
- `external_link`: Institution URL.
- `logo_url`: Logo image path.

### Experience (`public/data/experience.csv`)
- `id`: Unique ID.
- `job_title`: Position title (e.g., `Student Researcher`, `Software Engineer`).
- `company`: Company or organization name.
- `location`: City, Country (e.g., `Dhaka, Bangladesh`).
- `start_date` / `end_date`: `YYYY-MM-DD` (or leave `end_date` blank for `Present`).
- `employment_type`: `Full-time`, `Part-time`, `Fellowship`, `Internship`.
- `description`: Multi-line overview and bullet items.
- `skills_used`: Comma-separated skills utilized.
- `external_link`: Company website or LinkedIn.
- `logo_url`: Company logo image path.

### Volunteering & Leadership (`public/data/volunteer.csv`)
- `id`: Unique ID.
- `role`: Role title (e.g., `Volunteer`, `Project Lead`).
- `organization`: Non-profit or initiative name.
- `start_date` / `end_date`: `YYYY-MM-DD`.
- `duration`: Human-readable tenure (e.g., `2 yrs 9 mos`).
- `category`: Category (e.g., `Education`, `Social Impact`, `Fundraising`).
- `description`: Organization mission and personal contributions.
- `skills_gained`: Comma-separated leadership competencies.
- `external_link`: Organization website.
- `logo_url`: Organization logo path.

---

## 9. Editing Existing Content

1. Open the relevant CSV in `public/data/`.
2. Locate the row by its stable `id`.
3. Edit fields (title, description, dates, images, links).
4. Save the file.
5. Run `npm run validate:data`.

> [!CAUTION]
> **NEVER edit React components to update text, dates, or URLs.** If a title changed, update the CSV row.

---

## 10. Removing or Deactivating Content

- **Permanent Removal**: Delete the entire row from the CSV.
- **De-featuring from Homepage**: Change `is_featured` from `true` to `false` and clear `featured_order`. The item will still appear on its main page archive without cluttering the homepage spotlight.

---

## 11. Featured Content & Homepage Controls

Homepage previews and page spotlights are controlled entirely via:
- `is_featured`: Set to `true` (case-insensitive string `"true"` or `"1"`).
- `featured_order`: Integer defining display order (`1`, `2`, `3`, etc.).

Items with `is_featured=true` are sorted by `featured_order` ascending, then by year/date descending.

---

## 12. Images & Media Guidelines

- **Location**: Static assets live in `public/wall/`, `public/images/`, or directly in `public/`.
- **References & Path Normalization**:
  - Local root paths: `/wall/fahmida_with_robot.jpeg` (Recommended)
  - Public prefix paths: `public/wall/fahmida_with_robot.jpeg` or `public/image.png` (Automatically normalized)
  - Direct filenames: `image.png` or `wall/image.jpg` (Automatically normalized to `/image.png` and `/wall/image.jpg`)
  - External images: Full HTTPS URLs (`https://...`) are supported, but note the Content Security Policy in `index.html` only allows a fixed set of external hosts — a new domain must be added there or the browser will block it. Prefer adding the file to `public/images/` and referencing it locally.
- **Formats**: `.jpeg`, `.jpg`, `.png`, `.webp`.
- **Aspect Ratios**:
  - Project Cards: 16:9 or 4:3 (minimum 800x450px).
  - Research Bento: 16:10 (minimum 1000x625px).
  - Moments Gallery: 4:3 or 1:1 (minimum 600x600px).

---

## 13. Complex Field Syntax Reference

### Compound Sources / Links (`sources`, `links`)
Separate multiple link entries with semicolons `;`. Optionally include a pipe `|` to provide a custom button label.

Syntax:
`type:url|Custom Label ; type:url|Custom Label`

Supported types:
- `github` (Source Code)
- `video` / `youtube` (Video Demo)
- `paper` / `documentation` (Research Paper / Docs)
- `live_demo` / `demo` (Live Interactive Demo)
- `download` (Downloadable Asset / PDF)
- `other` (External Reference)

Example:
`github:https://github.com/farhan5384/repo|Source Code ; video:https://youtu.be/OBD1d048dl4|Watch Demo`

### Authors Field (`authors`)
Syntax:
`Author Name|GitHub URL|Website URL ; Next Author|...`

Example:
`Mst. Fahmida Sultana Naznin|https://github.com/farhan5384|https://fahmidasultana.me ; Dr. Rakibul Hasan`

### Media Gallery Field (`media`)
Syntax:
`type:url|Caption text ; type:url|Caption text`

Example:
`image:/wall/research_1.jpg|Conflict-Aware Multi-Agent Architecture ; youtube:https://youtu.be/OBD1d048dl4|Live Demonstration`

---

## 14. Automated Data Validation

The project includes an automated validation suite that checks all 10 CSV datasets for:
- Unique IDs with no duplicates.
- All required fields present.
- Valid boolean values (`true`/`false`).
- Valid numeric formats (`year`, `display_order`, `featured_order`).
- Clean delimiter formatting.

### Run Validation:
```bash
npm run validate:data
```

Validation is automatically executed before every production build (`prebuild` hook).

---

## 15. Development & Deployment Workflow

### 1. Local Development
```bash
npm install
npm run dev
```

### 2. Validate Data
```bash
npm run validate:data
```

### 3. Build & Test Production Bundle
```bash
npm run build
```

### 4. Commit and Deploy
```bash
git add public/data/
git commit -m "Update portfolio data: add new publication and awards"
git push origin main
```
Your continuous deployment provider (Vercel, GitHub Pages, Netlify) will build and deploy the updated site automatically!

---

## 16. What You Should NEVER Edit for Content Updates

Do NOT edit the following files when adding or updating portfolio content:
- `pages/Homepage.jsx`
- `pages/ProjectsPage.jsx`
- `pages/ResearchPage.jsx`
- `pages/AwardsPage.jsx`
- `pages/SkillsPage.jsx`
- `pages/BlogPage.jsx`
- `pages/CareerPage.jsx`
- `components/**/*.jsx`

---

## 17. When Code Changes ARE Necessary

Code changes in `components/` or `pages/` are ONLY needed when:
- Creating a brand-new page (e.g., adding a `/press` route).
- Adding a new UI widget, interactive layout, or animation effect.
- Extending a CSV schema with a completely new column and wiring it into UI presentation.

---

## 18. Troubleshooting Guide

| Issue | Cause | Solution |
|---|---|---|
| **Build fails on `validate:data`** | Missing required column, duplicate ID, or invalid boolean in CSV | Run `npm run validate:data` to see the exact file and row number with the issue. |
| **New item doesn't appear on Homepage** | `is_featured` is not set to `true` | Set `is_featured` to `"true"` and assign a `featured_order` integer in the CSV. |
| **Broken image or placeholder** | Typo in file path | Verify that the file exists in `public/wall/` or `public/images/` and the CSV has `/wall/filename.jpg`. |
| **Pills or tags not rendering** | Missing commas in `keywords` or `topics` | Ensure keywords are comma-separated strings (e.g. `PyTorch, OpenCV, 3D Vision`). |
| **Links not opening in modal** | Malformed `sources` string | Check that types use the format `type:https://...|Label` separated by `;`. |

---

## 19. Complete CSV Schema Reference

### `projects.csv`
| Column | Required | Type | Example | Description |
|---|---|---|---|---|
| `id` | Yes | string/int | `7` | Stable unique ID |
| `title` | Yes | string | `3D Object Reconstruction from Images` | Full project name |
| `thumbnail_url` | No | path/url | `/wall/fahmida_with_car.jpeg` | Teaser image path or URL |
| `description` | No | string | `Reconstructing 3D mesh models...` | Overview description |
| `presented_in` | No | string | `Computer Vision Research` | Context or venue |
| `presented_in_url` | No | url | `https://www.computer.org/` | Link to venue |
| `year` | No | number | `2024` | Year created |
| `keywords` | No | string | `3D Reconstruction, Computer Vision` | Comma-separated tech stack |
| `is_featured` | No | boolean | `true` | Show on Homepage featured projects |
| `featured_order` | No | number | `1` | Order among featured projects |
| `sources` | No | string | `video:https://...|Demo ; github:https://...` | Compound link sources |

### `research.csv`
| Column | Required | Type | Example | Description |
|---|---|---|---|---|
| `id` | Yes | string/int | `1` | Stable unique ID |
| `title` | Yes | string | `MedCAR: Conflict-Aware Multimodal...` | Research paper title |
| `publication` | No | string | `IEEE Transactions on Medical Imaging` | Publication outlet |
| `date` | No | date | `2026-02-01` | Publication date |
| `status` | No | string | `Under Review` | Paper status (`Published`, `Preprint`, etc.) |
| `topics` | No | string | `Medical AI, Multimodal Reasoning` | Comma-separated topics |
| `authors` | No | string | `Fahmida Hossain|https://... ; Dr. Jane Doe` | Compound author string |
| `links` | No | string | `paper:https://...|Paper ; code:https://...` | Compound links |
| `media` | No | string | `image:/wall/research_1.jpg|Architecture` | Compound media assets |
| `thumbnail_url` | No | path/url | `/wall/research_1.jpg` | Primary image |
| `year` | No | number | `2026` | Year |
| `is_featured` | No | boolean | `true` | Feature in Research spotlight |
| `featured_order` | No | number | `1` | Bento spotlight ranking |

### `awards.csv`
| Column | Required | Type | Example | Description |
|---|---|---|---|---|
| `id` | Yes | string/int | `4` | Stable unique ID |
| `title` | Yes | string | `NASA Space Apps Challenge 2024...` | Award title |
| `organization` | No | string | `NASA & BASIS` | Granting organization |
| `date` | No | string | `2024` | Date awarded |
| `category` | No | string | `Global` | Category (`Global`, `National`, `Academic`) |
| `description` | No | string | `Global nominee for autonomous AI system...` | Achievement description |
| `significance` | No | string | `Top 1% Worldwide` | Honor badge |
| `media` | No | string | `image:/wall/nasa_award.jpg|Certificate` | Attached media |
| `is_featured` | No | boolean | `true` | Show in featured marquee |
| `featured_order` | No | number | `1` | Rank among featured awards |
| `year` | No | number | `2024` | Year |

### `skills.csv`
| Column | Required | Type | Example | Description |
|---|---|---|---|---|
| `id` | Yes | string | `dom_1` / `lang_1` | Stable unique ID |
| `category` | Yes | string | `Domains` / `Languages` / `Frameworks` / `Tools` | Major skill category |
| `subcategory` | No | string | `Artificial Intelligence` / `PROGRAMMING LANGUAGES` | Grouping header |
| `name` | Yes | string | `Python` / `Artificial Intelligence` | Name of domain or skill |
| `proficiency` | No | string | `Deep Learning · ML · NLP` / `90` | Domain scope or rating |
| `is_primary` | No | boolean | `true` | Primary badge styling |
| `icon` | No | string | `Brain`, `Code2`, `Layers`, `Box` | Lucide icon name |
| `display_order` | No | number | `1` | Display sequence |
| `tags` | No | string | `Python,PyTorch,TensorFlow,Keras` | Branching tree techs (for Domains) |

---

## 20. Architecture Summary

- **CSV is the Single Source of Truth**: No database subscriptions or complex backends required.
- **Pages and Components Consume Normalized Data**: Zero raw CSV string parsing inside UI components.
- **Zero Hardcoded Portfolio Content**: Every title, date, image, and statistic is derived from data.
- **Zero Array-Index Dependencies**: Ordering and spotlighting are driven by `is_featured` and `featured_order`.
- **Automated Validation**: `npm run validate:data` catches missing fields, duplicate IDs, and syntax issues.

---

## 21. DO NOT BREAK THE DATA ARCHITECTURE

1. **Never copy CSV text into JSX/TSX.**
2. **Never create static project/publication arrays inside components.**
3. **Never use array indices (e.g., `projects[0]`) to identify items.**
4. **Never hardcode statistics (e.g. `"15 Projects"`). Use `projects.length`.**
5. **Never introduce hidden fallback data with fake portfolio items.**
6. **Always add/edit content in the corresponding CSV file in `public/data/`.**
