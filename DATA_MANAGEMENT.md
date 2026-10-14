# Portfolio Data Management & Authoring Guide

> [!IMPORTANT]
> **CSV-first content management**
> 
> Most editable portfolio records are stored in **16 CSV files** under `public/data/`. Some interface copy and data sets are still defined in code; check the “Connected?” column in Section 9 before adding a row.
> 
> For a connected CSV, add or edit a row in that file instead of changing React components. A CSV file does not appear on the site unless a loader and page/component use it.

---

## Table of Contents

1. [How Static Data Works in the Portfolio](#1-how-static-data-works-in-the-portfolio)
2. [Step-by-Step Guide: Appending New Data Rows](#2-step-by-step-guide-appending-new-data-rows)
3. [CSV Formatting & Syntax Rules](#3-csv-formatting--syntax-rules)
4. [Micro-Syntaxes Reference (Links, Authors, Media, Tags)](#4-micro-syntaxes-reference)
5. [Column Reference for the CSV Files](#5-complete-column-by-column-reference)
   - 5.1 [`projects.csv`](#51-projectscsv--software--engineering-projects)
   - 5.2 [`research.csv`](#52-researchcsv--academic-publications--preprints)
   - 5.3 [`awards.csv`](#53-awardscsv--honors-competitions--grants)
   - 5.4 [`blogs.csv`](#54-blogscsv--articles-stories--vlogs)
   - 5.5 [`skills.csv`](#55-skillscsv--technical-skills--domains)
   - 5.6 [`experience.csv`](#56-experiencecsv--academic--industry-work-history)
   - 5.7 [`education.csv`](#57-educationcsv--degrees--academic-institutions)
   - 5.8 [`volunteer.csv`](#58-volunteercsv--community-service--non-profit)
   - 5.9 [`leadership.csv`](#59-leadershipcsv--leadership--community-roles)
   - 5.10 [`social_links.csv`](#510-social_linkscsv--social-profiles--cv)
   - 5.11 [`moments.csv`](#511-momentscsv--photo-wall-snapshots)
   - 5.12 [`media_mentions.csv`](#512-media_mentionscsv--press-tv--news-features)
   - 5.13 [`news.csv`](#513-newscsv--monthly-announcements--updates)
   - 5.14 [`upcycling.csv`](#514-upcyclingcsv--sustainability-craft-projects)
   - 5.15 [`linkedin_featured.csv`](#515-linkedin_featuredcsv--linkedin-featured-items)
   - 5.16 [`professional_training.csv`](#516-professional_trainingcsv--professional-training)
6. [Image and Asset Guidelines](#6-image-and-asset-guidelines)
7. [Automated Data Validation & Pre-Build Gatekeeper](#7-automated-data-validation)
8. [Troubleshooting & Common Errors](#8-troubleshooting--common-errors)
9. [Display Order: What Appears First](#9-display-order-what-appears-first)

---

## 1. How Static Data Works in the Portfolio

The portfolio does not connect to any SQL or NoSQL database. Instead:

```
CSV Data File (public/data/<entity>.csv)
       │
       ▼
PapaParse Engine (src/utils/csvLoader.js)
       │
       ├── Normalizes booleans: "true" / "false" -> native boolean
       ├── Normalizes numbers: "2026", "1" -> native integer/float
       ├── Resolves local image paths against the configured Vite/GitHub Pages base path
       ├── Parses compound strings (links, authors, media, tags)
       └── Stores parsed array in in-memory Map cache
       │
       ▼
React 19 Pages & Components (Homepage, Projects, Research, Modals)
       └── Consumes clean, normalized JavaScript objects with zero UI code changes
```

---

## 2. Step-by-Step Guide: Appending New Data Rows

Use this workflow for any CSV-backed section. The ordering rules in Section 9 determine where the new record appears; appending it to the bottom of the file does not necessarily make it appear at the bottom of the page.

### Step 1: Open the CSV File
- Locate the appropriate CSV file in `public/data/` (e.g. `public/data/projects.csv`).
- Open it in your favorite spreadsheet editor (**Microsoft Excel**, **Google Sheets**, **Apple Numbers**) or a text editor (**VS Code**, **Notepad**).

### Step 2: Add a New Row
- Keep the existing header row and column order unchanged. Each record must have the same number of columns as the header.
- Give the record an `id` that is unique within that CSV. IDs do not need to be unique across different CSV files.
- Fill required fields using the schema in Section 5. Leave optional fields blank when they do not apply.
- Set the ordering field using Section 9. The page sorts records by its configured field, not by where the row was inserted in the file.
- Append the row at the end of the file to make review and version-control diffs easier.

### Step 3: Add Media Files (If Applicable)
- Put images inside `public/images/`, `public/wall/`, or an appropriate subfolder (for example, `public/images/campus/`).
- Use a site-root path in the CSV, such as `/images/your_image_name.jpg`, `/images/campus/logo.png`, or `/wall/photo.jpg`. Never use a computer-specific drive path. The loader resolves local paths against the GitHub Pages base path.
- Match filename capitalization and extension exactly. GitHub Pages is case-sensitive. Confirm the file exists at the referenced path.

### Step 4: Validate Your Data
Run the validator and production build in your terminal:
```bash
npm run validate:data
npm run build
```
The validator reports malformed CSV, duplicate or missing IDs, missing configured required fields, and invalid configured boolean/numeric values. It currently covers 15 datasets; `linkedin_featured.csv` is not configured. It does not check image paths, URL validity, date formats, or whether a CSV is connected to a page, so check those manually.

### Step 5: Preview Locally
Start your local dev server:
```bash
npm run dev
```
Open `http://localhost:5173/fahmida_protofolio/` to inspect your newly added item.

Check the relevant page and, when applicable, its homepage preview. Confirm the image loads, links open the intended destination, text is visible, and the item appears in the intended order. Stop the dev server with `Ctrl+C` when finished.

---

## 3. CSV Formatting & Syntax Rules

To prevent CSV parsing errors, follow standard RFC 4180 CSV conventions:

1. **Quoting Strings with Commas:** If a column value contains a comma `,`, wrap the entire field in double quotes `"..."`:
   ```csv
   "Medical AI, Deep Learning, Spring Boot, React"
   ```
2. **Escaping Double Quotes Inside Fields:** If a description or title contains double quotation marks, escape each quote by doubling it `""`:
   ```csv
   "- Working in ""Library Project"" specifically for underprivileged children."
   ```
3. **Multi-line Text (Newlines):** Multiline fields (like `description` or `activities`) must be wrapped in double quotes. Line breaks inside quotes are fully supported.
4. **Booleans:** Always write booleans in lowercase: `true` or `false`.
5. **No Trailing Empty Columns:** Ensure the number of commas matches the header columns on every row.

---

## 4. Micro-Syntaxes Reference

Several columns in the portfolio support powerful compound string formats that allow multiple links, multi-author networks, and multimedia galleries to be defined cleanly in a single CSV cell.

### 4.1 Compound Sources & Links (`sources`, `links`)
Used in `projects.csv`, `research.csv`, and `blogs.csv`.

**Syntax:**  
`type:url|Custom Button Label ; type:url|Custom Button Label`

- Entries are separated by a **semicolon** ` ; `.
- The link type and URL are separated by a **colon** `:`.
- Optional custom button text is separated by a **pipe** `|`.

**Supported Types & Default Labels:**
| Type Prefix | Default Button Label | Typical Use Case |
|---|---|---|
| `github:` | *Source Code* | Open-source GitHub repository |
| `live_demo:` | *Live Demo* | Deployed interactive web app |
| `paper:` | *Documentation* | arXiv, IEEE, ACM, or DOI paper link |
| `code:` | *Source Code* | Model weights, notebook, or code repo |
| `video:` / `youtube:` | *Video Demo* | YouTube demo or presentation video |
| `download:` | *Download* | Direct PDF, dataset, or zip download |
| `documentation:` | *Documentation* | Whitepaper, technical specs, or README |
| `external:` / `other:` | *External Link* | Generic external reference |

**Example:**
```csv
live_demo:https://www.pinklifeline.com/|Live Platform ; video:https://youtu.be/0xes6eOvChk|Product Pitch ; github:https://github.com/fahmidahossain/pinklifeline|Source Code
```

---

### 4.2 Authors List (`authors`)
Used in `research.csv`.

**Syntax:**  
`Author Name|GitHub URL|Website URL ; Next Author Name|...`

- Entries are separated by a **semicolon** ` ; `.
- Author Name, GitHub profile, and Personal Website are separated by **pipes** `|`.
- The system automatically detects Fahmida (`Mst. Fahmida Sultana Naznin` or `Fahmida Hossain`) and applies a distinct gold/accent highlight badge to her name.

**Example:**
```csv
Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain|https://fahmidasultana.me ; Dr. Jane Doe|https://github.com/janedoe|https://janedoe.com ; Prof. Alan Turing
```

---

### 4.3 Media Gallery (`media`)
Used in `research.csv`, `awards.csv`, `blogs.csv`.

**Syntax:**  
`media_type:url|Caption text ; media_type:url|Caption text`

- **Supported Media Types:** `image`, `youtube`, `video`, `pdf`.
- If `media_type` is omitted, image URLs ending in standard extensions are inferred as `image`, while `youtu.be` and `youtube.com` links are automatically inferred as `youtube`.

**Example:**
```csv
image:/images/research_fig1.jpg|Conflict-Aware Multimodal Fusion Architecture ; youtube:https://youtu.be/jyerIT_txG0|ACL 2025 Oral Presentation
```

---

### 4.4 Comma-Separated Tag Lists (`keywords`, `topics`, `skills_used`, `tags`)
Used in `projects.csv`, `research.csv`, `skills.csv`, `experience.csv`.

**Syntax:**  
`Tag One, Tag Two, Tag Three`

- Simple comma-separated list.
- Spaces around tags are automatically trimmed.

---

## 5. Complete Column-by-Column Reference

---

### 5.1 `projects.csv` — Software & Engineering Projects
*Powers the `/projects` page, project filtering tabs, project search, full-screen detail modals, and the Homepage Featured Projects Carousel.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `12` | Unique persistent identifier. Must never be duplicated. |
| `title` | **Yes** | String | `PinkLifeLine: AI Breast Cancer Detection` | Full display name of the project. |
| `thumbnail_url` | No | Path/URL | `/images/pinklifeline.jpg` | Main teaser thumbnail image path or web URL. |
| `description` | No | String | `Enterprise digital health ecosystem...` | Full project overview, architectural summary, and impact. |
| `presented_in` | No | String | `Johns Hopkins Design Competition` | Conference, hackathon, competition, or course context. |
| `presented_in_url` | No | URL | `https://cbid.bme.jhu.edu/` | Link to the venue or event website. |
| `year` | No | Integer | `2025` | Creation / release year (used for chronological sorting). |
| `keywords` | No | String | `Medical AI, React, Docker, Kubernetes` | Comma-separated list of technologies and disciplines. |
| `is_featured` | No | Boolean | `true` | Set to `true` to feature in the Homepage carousel; `false` for archive only. |
| `featured_order` | No | Integer | `1` | Ranking position on the Homepage carousel (`1`, `2`, `3`...). |
| `sources` | No | String | `live_demo:https://... ; github:https://...` | Semicolon-delimited compound links (see [Section 4.1](#41-compound-sources--links-sources-links)). |

**Example Appended Row:**
```csv
"12","Autonomous Crop Disease Rover","/images/crop_rover.jpg","Solar-powered autonomous rover utilizing edge computer vision for real-time plant disease detection and localized pesticide spraying.","AgriTech Global Challenge 2026","https://agritech.org","2026","Robotics, Computer Vision, PyTorch, ROS2, Raspberry Pi","true","5","github:https://github.com/fahmidahossain/agri-rover|Source Code ; video:https://youtu.be/example|Field Test Demo"
```

---

### 5.2 `research.csv` — Academic Publications & Preprints
*Powers the `/research` page, topic filters, Bento Research Spotlight on Homepage and Research page, and the automated BibTeX citation generator.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `10` | Unique persistent identifier. |
| `title` | **Yes** | String | `CSTRL: Context-Driven Transfer Learning...` | Full academic paper title. |
| `thumbnail_url` | No | Path/URL | `/images/research_1.jpg` | Primary paper figure, architecture diagram, or thumbnail. |
| `description` | No | String | `Paper summary or presentation notes...` | Concise summary of findings. |
| `abstract` | No | String | `Abstractive radiology report summarization...` | Complete academic abstract. |
| `status` | No | String | `published` | Publication status: `published`, `preprint`, `under_review`, `accepted`. |
| `award` | No | String | `Best Paper Award Runner-Up` | Any honor or distinction awarded to this paper. |
| `year` | No | Integer | `2025` | Publication or preprint year. |
| `topics` | No | String | `Clinical NLP & LLMs, Medical AI` | Comma-separated research disciplines (used for filter tabs). |
| `authors` | No | String | `Mst. Fahmida Sultana Naznin ; Adnan Faruq` | Compound authors list with links (see [Section 4.2](#42-authors-list-authors)). |
| `links` | No | String | `paper:https://doi.org/... ; code:https://...` | Compound paper links (DOI, arXiv, code repository). |
| `media` | No | String | `image:/images/fig1.png ; youtube:https://...` | Compound gallery figures and presentation recordings. |
| `is_featured` | No | Boolean | `true` | Set to `true` to feature in the Bento Research Spotlight. |
| `featured_order` | No | Integer | `1` | Ranking position in the Bento Spotlight grid. |
| `venue` | No | String | `ACL 2025 (Findings)` | Journal, conference, or workshop venue name. |
| `external_url` | No | URL | `https://doi.org/10.18653/v1/2025` | Direct DOI, publisher, or arXiv URL. |
| `has_demo` | No | Boolean | `true` | Set to `true` if an interactive web demo or video exists. |
| `demo_url` | No | URL | `https://github.com/.../Report_Summarization` | Direct link to demo repository, video, or HuggingFace Space. |
| `bibtex` | No | String | `@article{...}` | Optional raw BibTeX citation. If left blank, BibTeX is automatically generated. |

---

### 5.3 `awards.csv` — Honors, Competitions & Grants
*Powers the `/awards` page, category filters, certificate modal viewer, and the Homepage Recognition Marquee.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `58` | Unique identifier. |
| `title` | **Yes** | String | `Champion | 2025 Johns Hopkins Design Comp.` | Award headline and recognition level. |
| `thumbnail_url` | No | Path/URL | `/images/jhu_award.jpg` | Main award badge, ceremony photo, or certificate thumbnail. |
| `organization_name` | No | String | `Johns Hopkins University & J&J MedTech` | Awarding institution or granting body. |
| `organization_url` | No | URL | `https://cbid.bme.jhu.edu/...` | Link to the official announcement or granting body. |
| `description` | No | String | `Secured 1st Place out of 440 projects...` | Detailed background, track, project name, and prize funding. |
| `topic` | No | String | `Global Competitions` | Category filter: `Global Competitions`, `National Competitions`, `Academic Honors`, `Grants & Fellowships`. |
| `year` | No | Integer | `2025` | Year awarded. |
| `media` | No | String | `image:/images/cert.jpg ; youtube:https://...` | Compound media attachments (certificates, ceremony photos). |
| `is_featured` | No | Boolean | `true` | Set to `true` to highlight in high-priority showcases. |
| `featured_order` | No | Integer | `1` | Display order among featured awards. |
| `showcase_home` | No | Boolean | `true` | Set to `true` to display in the Homepage Recognition Marquee strip. |

---

### 5.4 `blogs.csv` — Articles, Stories & Vlogs
*Powers the `/blog` page, article detail views, video vlog strip, and story search.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `3` | Unique identifier. |
| `title` | **Yes** | String | `From Water Hyacinth to the UN: Thailand Journey` | Article or vlog title. |
| `thumbnail_url` | No | Path/URL | `/images/thailand_trip.jpg` | Hero banner image or video cover image. |
| `description` | No | String | `From an idea about biofuel to presenting at UN...`| Short excerpt for cards and previews. |
| `content` | No | String | `Some journeys begin with a destination...` | Full article content (supports rich text, newlines, and Markdown). |
| `published_date` | No | Date (`YYYY-MM-DD`) | `2025-11-20` | Date published (used for descending chronological sort). |
| `location` | No | String | `Bangkok, Thailand` | Geographic location tag. |
| `category` | No | String | `Reflection` | Tag: `Reflection`, `Tech Vlog`, `AI & Research`, `Travel`. |
| `read_time` | No | String | `8 min read` | Read time or watch duration (`8 min read`, `15 min watch`). |
| `is_featured` | No | Boolean | `true` | Retained in the schema; it currently does not change the Blog page's date-sorted list. |
| `featured_order` | No | Integer | `1` | Retained in the schema; the current Blog loader sorts by `published_date`, not this field. |
| `links` | No | String | `external:https://un.org|UN ESCAP Report` | Compound reference links. |
| `media` | No | String | `youtube:https://youtu.be/...|Watch Vlog` | Compound video or gallery attachments. |

---

### 5.5 `skills.csv` — Technical Skills & Domains
*Powers the `/skills` page's Languages, Frameworks & Tooling groups. Rows with `category=Domains` are excluded from this section.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String | `dom_1` or `lang_1` | Unique ID. Prefix with `dom_`, `lang_`, `frame_`, or `tool_`. |
| `category` | **Yes** | String | `Domains` | Must be one of: `Domains`, `Languages`, `Frameworks`, `Tools`. |
| `subcategory` | No | String | `Artificial Intelligence` | Grouping header (e.g. `PROGRAMMING LANGUAGES`, `AI & MACHINE LEARNING`). |
| `name` | **Yes** | String | `AI in Healthcare` or `Python` | Display name of the skill or domain. |
| `proficiency` | No | String | `Biomedical AI · Medical Imaging` / `90` | Domain summary bullet or numeric percentage for languages. |
| `is_primary` | No | Boolean | `true` | Set to `true` for gold/accent highlight pill styling. |
| `icon` | No | String | `Brain`, `Layers`, `Code2`, `Cpu` | Name of the Lucide React icon component to render. |
| `display_order` | No | Integer | `1` | Ascending sort sequence within its category. |
| `tags` | No | String | `PyTorch,Clinical AI,MIMIC-IV` | Comma-separated branching sub-technologies (for `Domains` cards). |

---

### 5.6 `experience.csv` — Academic & Industry Work History
*Powers the Work Experience timeline on the `/career` page.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `job_title` | **Yes** | String | `Lecturer in CSE` | Official job title. |
| `company` | **Yes** | String | `Stamford University Bangladesh` | Company, university, or institute name. |
| `location` | No | String | `Dhaka, Bangladesh` | City and country. |
| `start_date` | No | Date (`YYYY-MM-DD`) | `2026-09-09` | Employment start date. |
| `end_date` | No | Date (`YYYY-MM-DD`) | `2027-01-01` | Employment end date. Leave blank for `Present`. |
| `employment_type` | No | String | `Full-time` | Type: `Full-time`, `Part-time`, `Research`, `Fellowship`, `Internship`. |
| `description` | No | String | `- Teach undergraduate courses...` | Multi-line responsibilities, achievements, and courses taught. |
| `skills_used` | No | String | `Teaching, Curriculum Design, AI` | Comma-separated list of competencies utilized. |
| `external_link` | No | URL | `https://stamforduniversity.edu.bd` | Company or department website. |
| `logo_url` | No | Path/URL | `/images/undergrad.jpeg` | Institution or company logo image path. |
| `sort_order` | No | Integer | `1` | Present in the CSV schema, but the current Career page sorts experience by `start_date` descending; this field currently does not control its position. |

---

### 5.7 `education.csv` — Degrees & Academic Institutions
*Powers the Academic Background timeline on the `/career` page.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `institution` | **Yes** | String | `Bangladesh University of Engineering and Tech.` | University, college, or school name. |
| `degree_level` | **Yes** | String | `Bachelor of Science (B.Sc.)` | Degree level (`Bachelor of Science`, `HSC`, `SSC`, `Master of Science`). |
| `field_of_study` | No | String | `Computer Science and Engineering` | Major or department concentration. |
| `start_year` | No | Integer | `2022` | Starting year. |
| `end_year` | No | Integer | `2026` | Graduation year. |
| `grade` | No | String | `Graduated with CGPA 3.78/4.00` | GPA, CGPA, class standing, or academic distinction. |
| `activities` | No | String | `Dean's Award, Research Specialization...` | Multi-line description of extracurriculars, thesis, and honors. |
| `skills` | No | String | `Deep Learning, Biomedical AI, NLP` | Comma-separated competencies developed during the degree. |
| `external_link` | No | URL | `https://buet.ac.bd` | Institution website link. |
| `logo_url` | No | Path/URL | `/images/undergrad.jpeg` | Institution crest or logo path. |

---

### 5.8 `volunteer.csv` — Community Service & Non-Profit
*Powers the Community & Volunteering section on the `/career` page.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `role` | **Yes** | String | `Volunteer Educator` | Volunteering role title. |
| `organization` | **Yes** | String | `Agami Education Foundation (AEF)` | Non-profit organization name. |
| `start_date` | No | Date (`YYYY-MM-DD`) | `2024-02-01` | Start date. |
| `end_date` | No | Date (`YYYY-MM-DD`) | `2026-08-30` | End date (leave blank for ongoing). |
| `duration` | No | String | `2 yrs 7 mos` | Human-readable tenure text. |
| `category` | No | String | `Education` | Category: `Education`, `Social Impact`, `Environment`, `Community`. |
| `description` | No | String | `Agami is a US-registered non-profit...` | Organization mission statement. |
| `responsibilities`| No | String | `Conducted literacy workshops...` | Specific duties and initiatives handled. |
| `skills_gained` | No | String | `Public Speaking, Mentorship` | Comma-separated competencies developed. |
| `external_link` | No | URL | `https://agami.org` | Non-profit website URL. |
| `logo_url` | No | Path/URL | `/images/agami_logo.png` | Organization logo image path. |
| `sort_order` | No | Integer | `1` | Present in the CSV schema, but volunteer entries currently sort by `start_date` descending; this field currently does not control their position. |

---

### 5.9 `leadership.csv` — Leadership & Community Roles
*Powers the Leadership & Organizational Governance section on the `/career` page.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `role` | **Yes** | String | `Dir. of Outreach Management` | Executive or leadership title. |
| `organization` | **Yes** | String | `Bangladeshi Women in CSE (BWCSE)` | Organization name. |
| `start_date` | No | Date (`YYYY-MM-DD`) | `2025-04-01` | Appointment start date. |
| `end_date` | No | Date (`YYYY-MM-DD`) | `2026-09-01` | End date (leave blank for Present). |
| `duration` | No | String | `Apr 2025 – Present` | Display tenure text. |
| `category` | No | String | `Women in Tech` | Category classification. |
| `description` | No | String | `Leading nationwide community initiatives...` | Overview of organizational mission. |
| `responsibilities`| No | String | `Driving strategic partnerships...` | Specific executive duties and programs led. |
| `skills_gained` | No | String | `Strategic Partnerships, Leadership` | Comma-separated leadership competencies. |
| `external_link` | No | URL | `https://www.facebook.com/bwcse/` | Official organization link or page. |
| `logo_url` | No | Path/URL | `/images/bwcse_logo.png` | Organization emblem or logo path. |
| `sort_order` | No | Integer | `1` | Career page order, ascending. Use `1` for the first entry; blank or `0` defaults to `999` and generally appears last. |

---

### 5.10 `social_links.csv` — Social Profiles & CV
*Powers Header, Footer, Hero social buttons, and CV download actions.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `platform` | **Yes** | String | `linkedin` | Platform key: `linkedin`, `github`, `facebook`, `instagram`, `researchgate`, `cv`. |
| `url` | **Yes** | URL/Path | `https://linkedin.com/in/...` or `/CV/resume.pdf` | Direct web profile link or local PDF path in `public/CV/`. |
| `icon` | No | String | `linkedin`, `github`, `file-text` | Lucide icon identifier. |
| `sort_order` | No | Integer | `1` | Left-to-right display order. |

---

### 5.11 `moments.csv` — Photo Wall Snapshots
*Powers the interactive DriftWall gallery on the Homepage. The Blog page's Media Mentions section uses `media_mentions.csv`, not this file.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `image_url` | **Yes** | Path/URL | `/wall/(1).jpg` | Image path in `public/wall/` or full URL. |
| `caption` | No | String | `Global Research Fellowship Collaboration` | Descriptive tooltip/caption. |
| `display_order` | No | Integer | `1` | Sequence order in the gallery stream. |

---

### 5.12 `media_mentions.csv` — Press, TV & News Features
*Powers the full Media Mentions section on the Blog page and the first six ordered cards on the Homepage.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `title` | **Yes** | String | `Channel 24 Exclusive: Empowering Women in AI` | Headline of broadcast or newspaper article. |
| `outlet` | **Yes** | String | `Channel 24` | Name of TV channel, newspaper, or media portal. |
| `media_type` | **Yes** | String | `tv` | Media format: `tv`, `newspaper`, `facebook`, `youtube`, `article`. |
| `image_url` | No | Path/URL | `/images/ch24_interview.jpg` | Video thumbnail or newspaper clipping photo path. |
| `media_url` | No | URL | `https://www.youtube.com/watch?v=...` | Direct YouTube or video stream URL. |
| `external_link` | No | URL | `https://channel24bd.tv/news/...` | Published article URL or web portal link. |
| `date` | No | Date (`YYYY-MM-DD`) | `2026-02-18` | Broadcast / publication date. |
| `caption` | No | String | `Broadcast interview spotlighting PinkLifeLine...` | Comprehensive summary of the coverage. |
| `display_order` | No | Integer | `1` | Display sequence. |
| `is_featured` | No | Boolean | `true` | Retained in the schema, but the current homepage preview shows the first six records by `display_order`; this flag does not change that selection. |

---

### 5.13 `news.csv` — Monthly Announcements & Updates
*Powers the Homepage News & Monthly Updates marquee; all rows are shown in newest-date-first order.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `title` | **Yes** | String | `Join Stamford University Bangladesh as Lecturer` | News headline. |
| `date` | No | Date (`YYYY-MM-DD`) | `2026-09-01` | Date of the milestone/announcement. |
| `category` | No | String | `Academic Appointment` | Category tag (`Academic Appointment`, `Research Milestone`, `Grant`). |
| `summary` | No | String | `Joined CSE department as a Lecturer...` | 1-2 sentence preview for cards. |
| `details` | No | String | `Commenced teaching undergraduate courses...` | Full expanded text for detail modals. |
| `image_url` | No | Path/URL | `/images/undergrad.jpeg` | Accompanying thumbnail photo. |
| `external_link` | No | URL | `https://stamforduniversity.edu.bd` | Related official link. |
| `is_featured` | No | Boolean | `true` | Retained in the schema; the current homepage displays all news rows and does not filter by this flag. |
| `sort_order` | No | Integer | `1` | Present in the CSV schema, but the current homepage sorts news by `date` descending; this field currently does not control order. |

---

### 5.14 `upcycling.csv` — Sustainability & Craft Projects
*CSV and validation schema exist, but no current page or component loads this file. Adding a row alone will not display it on the website.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `title` | **Yes** | String | `Geometric Lamp Shade from Recycled Cardboard` | Craft project title. |
| `description` | No | String | `Made from recycled cardboard and wooden rulers...` | Overview of materials and process. |
| `image_url` | No | Path/URL | `/images/up_1.jpeg` | Photo of the creation. |
| `instagram_link` | No | URL | `https://instagram.com/p/...` | Instagram post or video link. |
| `display_order` | No | Integer | `1` | Display order. |

---

### 5.15 `linkedin_featured.csv` — LinkedIn Featured Items
*A loader and card component exist, but the component is not currently connected to a page. Adding a row alone will not display it. This file is also not included in `scripts/validateData.js`.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | Yes | String/Int | `29` | Unique identifier within this file. |
| `title` | Yes in practice | String | `Global Changemaker Fellowship Cohort 4.0` | Featured post/card title. |
| `description` | No | String | `Selected as one of 33 fellows...` | Supporting text. |
| `image_url` | No | Path/URL | `/images/featured/fellowship.jpg` | Local thumbnail or full image URL. |
| `external_link` | No | URL | `https://www.linkedin.com/feed/update/...` | Destination opened by the card. |
| `source_label` | No | String | `Connecting Dreams Foundation` | Organization or platform label. |
| `display_order` | No | Integer | `1` | Loader sorts ascending. Note: the unused homepage component re-sorts descending and shows six, so confirm which order is desired before connecting it. |

---

### 5.16 `professional_training.csv` — Professional Training
*Powers the Professional Training section on the Skills page.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | Yes | String/Int | `2` | Unique identifier within this file. |
| `title` | Yes | String | `Faculty Development (Foundation) Training (FT-N9)` | Programme title. |
| `institution` | Yes | String | `Institutional Quality Assurance Cell (IQAC), Stamford University Bangladesh` | Provider or institution. |
| `date_range` | No | String | `22 September–7 November 2026 | 6 Scheduled days` | Display-ready schedule text. |
| `description` | No | String | `Selected for the foundation-level faculty development programme...` | Programme summary. |
| `responsibilities` | No | Multiline string | `Teaching–learning methodologies\nAssessment and evaluation` | Focus areas, one per line. Quote the entire CSV field when it contains line breaks. |
| `sort_order` | No | Integer | `1` | Display order ascending; blank or `0` defaults to `999`. |

---

## 6. Image and Asset Guidelines

1. **Storage Folders:**
   - Primary project/award/paper images: `public/images/`
   - Gallery wall snapshots: `public/wall/`
   - CV / Resume PDF files: `public/CV/`
2. **Path Convention in CSV:**
   - Always write paths starting with a forward slash: `/images/filename.jpg` or `/wall/photo.jpg`.
   - The runtime `assetUrl.js` helper automatically adapts this path to the GitHub Pages base `/fahmida_protofolio/images/filename.jpg`.
3. **Optimizing Images:**
   - To regenerate fast WebP thumbnails for the photo wall, run:
     ```bash
     npm run optimize:images
     ```

---

## 7. Automated Data Validation

The repository includes a validation script (`scripts/validateData.js`) that checks 15 configured CSV files (there are 16 CSVs in `public/data/`). It checks:
- Unique `id` values with zero duplicates.
- Required fields configured in the validator are present and non-empty.
- Valid boolean values (`true`, `false`, `1`, `0`, `yes`, or `no`); use lowercase `true` or `false` for new rows.
- Valid numeric formats for configured numeric fields (`year`, `display_order`, `featured_order`, `sort_order`).

The validator does not check `linkedin_featured.csv`, image-file paths, external URLs, date formats, whether a dataset is used by a page, or whether ordering matches your intended presentation. Check those while previewing the site.

### Running the Validator
```bash
npm run validate:data
```

> [!NOTE]
> The validator automatically runs before every production build via the `prebuild` npm script. If a CSV has an error, the build halts safely to prevent shipping broken pages to production.

---

## 8. Troubleshooting & Common Errors

| Error Message in Terminal | Cause | How to Fix |
|---|---|---|
| `❌ Duplicate ID detected: "5"` | Two rows in the same CSV share the same ID. | Change the ID of the new row to an unused integer or string. |
| `❌ Missing required field "title"` | A mandatory column was left blank. | Fill in the required column value for that row. |
| `❌ Invalid boolean value for "is_featured": "maybe"` | Value is not a recognized boolean. | Use lowercase `true` or `false` for clarity. |
| `❌ Invalid numeric value for "year": "2024-05"` | `year` column received a date string instead of a 4-digit number. | Change value to `2024`. Use the `date` column for full `YYYY-MM-DD` dates. |
| Broken image on live site | Typo in file name or missing image file. | Check `public/images/` to confirm the exact filename and case sensitivity (e.g. `.jpg` vs `.jpeg`). |
| Card links not clicking properly | Malformed syntax in `sources` or `links`. | Ensure links use `type:url|Label` format separated by ` ; `. |

---

## 9. Display Order: What Appears First

Appending a CSV row at the bottom makes diffs easier to review, but **the row's sort field or date determines its display position**. Current ordering is implemented in `src/utils/csvLoader.js` and, for career records, `pages/CareerPage.jsx`.

| CSV | Connected to a page now? | Current display order | To place a new record near the top |
|---|---|---|---|
| `awards.csv` | Yes: Awards page and homepage recognition preview | `featured_order` ascending, then `year` newest first. Homepage recognition preview also requires `showcase_home=true`. | Set a low positive `featured_order`; use `showcase_home=true` if it should appear on the homepage. |
| `blogs.csv` | Yes: Blog page | `published_date` newest first. `featured_order` does not currently set the list order. | Enter the correct latest date in `YYYY-MM-DD` format. |
| `education.csv` | Yes: Career page | `start_year` newest first. | Use the latest `start_year`. |
| `experience.csv` | Yes: Career page | `start_date` newest first. `sort_order` is currently ignored. | Use the latest `start_date` in `YYYY-MM-DD` format. |
| `leadership.csv` | Yes: Career page | `sort_order` ascending. The page applies this order after loading. | Use a low positive `sort_order` (for example, `1`). |
| `linkedin_featured.csv` | **No**: loader/component exist, but no page currently uses them | Loader sorts `display_order` ascending. An unused homepage component reverses the order and selects six. | Not displayed yet. Connect the component to a page before adding items for display. |
| `media_mentions.csv` | Yes: Blog Media Mentions and homepage preview | `display_order` ascending; homepage shows the first six. `is_featured` does not currently filter the homepage preview. | Use a low positive `display_order` to place it earlier and potentially within the homepage six. |
| `moments.csv` | Yes: Homepage DriftWall | `display_order` ascending. | Use a low positive `display_order`. |
| `news.csv` | Yes: Homepage news carousel | `date` newest first. `sort_order` is currently ignored. | Use the latest valid `date` in `YYYY-MM-DD` format. |
| `professional_training.csv` | Yes: Skills page | `sort_order` ascending. | Use a low positive `sort_order`. |
| `projects.csv` | Yes: Projects page and project highlights | `featured_order` ascending, then `year` newest first. `is_featured=true` controls featured-project highlights. | Use a low positive `featured_order`; set `is_featured=true` for featured placements. |
| `research.csv` | Yes: Research page and research highlights | `featured_order` ascending, then `year` newest first. `is_featured=true` controls research spotlights. | Use a low positive `featured_order`; set `is_featured=true` for spotlight placements. |
| `skills.csv` | Yes: Skills page | Grouped by skill category/subcategory, then `display_order` ascending within each rendered group. | Add the record to the intended category/subcategory and set its relative `display_order`. |
| `social_links.csv` | Yes: Homepage and footer | `sort_order` ascending. | Use a low positive `sort_order`. |
| `upcycling.csv` | **No**: no current page/component loads this file | No website display order because it is not connected. | Not displayed yet. Connect a page/loader before adding items for display. |
| `volunteer.csv` | Yes: Career page | `start_date` newest first. `sort_order` is currently ignored. | Use the latest `start_date` in `YYYY-MM-DD` format. |

**Numeric order fields:** use positive integers beginning at `1`. The current loaders convert blank or `0` order values to `999`, which usually puts those records last. When two records have the same order value, their relative order may depend on the secondary date/year sort or original CSV order; use distinct values when a precise sequence matters.

**Before publishing:** verify the file's display order by opening the relevant page locally. This catches cases where a sort field exists in the CSV but the page currently sorts by a different field, or where a CSV is not connected at all.
