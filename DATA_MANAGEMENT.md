# Portfolio Data Management & Authoring Guide

> [!IMPORTANT]
> **100% DATA-DRIVEN ARCHITECTURE — ZERO HARDCODED CONTENT**
> 
> All portfolio content (projects, research publications, awards, blog posts, skills, career history, media coverage, news updates, moments, and social links) is driven entirely by **14 CSV files** located in `public/data/`.
> 
> **NEVER edit React components (`.jsx` files) to update text, dates, links, or images.** Simply append or modify rows in the appropriate CSV file, validate, test locally, and push to deploy.

---

## Table of Contents

1. [How Static Data Works in the Portfolio](#1-how-static-data-works-in-the-portfolio)
2. [Step-by-Step Guide: Appending New Data Rows](#2-step-by-step-guide-appending-new-data-rows)
3. [CSV Formatting & Syntax Rules](#3-csv-formatting--syntax-rules)
4. [Micro-Syntaxes Reference (Links, Authors, Media, Tags)](#4-micro-syntaxes-reference)
5. [Complete Column-by-Column Reference for All 14 CSV Files](#5-complete-column-by-column-reference)
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
6. [Image and Asset Guidelines](#6-image-and-asset-guidelines)
7. [Automated Data Validation & Pre-Build Gatekeeper](#7-automated-data-validation)
8. [Troubleshooting & Common Errors](#8-troubleshooting--common-errors)

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
       ├── Resolves image paths: "public/foo.jpg" -> "/fahmida_protofolio/foo.jpg"
       ├── Parses compound strings (links, authors, media, tags)
       └── Stores parsed array in in-memory Map cache
       │
       ▼
React 19 Pages & Components (Homepage, Projects, Research, Modals)
       └── Consumes clean, normalized JavaScript objects with zero UI code changes
```

---

## 2. Step-by-Step Guide: Appending New Data Rows

Follow these simple steps whenever you want to add a new project, paper, award, or experience:

### Step 1: Open the CSV File
- Locate the appropriate CSV file in `public/data/` (e.g. `public/data/projects.csv`).
- Open it in your favorite spreadsheet editor (**Microsoft Excel**, **Google Sheets**, **Apple Numbers**) or a text editor (**VS Code**, **Notepad**).

### Step 2: Add a New Row at the Bottom
- **Assign a globally unique `id`:** Look at the existing IDs in that file and choose a new unique ID (e.g., if IDs `1` through `11` exist, use `12`).
- **Fill in the columns:** Enter information for each column according to the column schema specifications detailed in [Section 5](#5-complete-column-by-column-reference).
- **Handle empty/optional fields:** If an optional field does not apply, leave it blank (`""` or empty between commas).

### Step 3: Add Media Files (If Applicable)
- If your new item includes an image, place the image in `public/images/` or `public/wall/`.
- Reference it in the CSV as `/images/your_image_name.jpg` or `/wall/your_image_name.jpg`.

### Step 4: Validate Your Data
Before running or building, run the built-in validation script in your terminal:
```bash
npm run validate:data
```
If you made any formatting mistake (duplicate ID, missing required field, bad boolean value), the validator will pinpoint the exact file and row number.

### Step 5: Test Locally
Start your local dev server:
```bash
npm run dev
```
Open `http://localhost:5173/fahmida_protofolio/` to inspect your newly added item.

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
| `is_featured` | No | Boolean | `true` | Show in top featured journal spotlight. |
| `featured_order` | No | Integer | `1` | Ranking in featured spotlight. |
| `links` | No | String | `external:https://un.org|UN ESCAP Report` | Compound reference links. |
| `media` | No | String | `youtube:https://youtu.be/...|Watch Vlog` | Compound video or gallery attachments. |

---

### 5.5 `skills.csv` — Technical Skills & Domains
*Powers the `/skills` page: Domain Specialization cards (Core Expertise) and Interactive Technology Stack pills.*

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
| `sort_order` | No | Integer | `1` | Priority sorting order (items also sort by `start_date` descending). |

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
| `sort_order` | No | Integer | `1` | Display sequence. |

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
| `sort_order` | No | Integer | `1` | Display sequence. |

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
*Powers the interactive 3D DriftWall gallery on the Homepage and the Moments strip on the Blog page.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `image_url` | **Yes** | Path/URL | `/wall/(1).jpg` | Image path in `public/wall/` or full URL. |
| `caption` | No | String | `Global Research Fellowship Collaboration` | Descriptive tooltip/caption. |
| `display_order` | No | Integer | `1` | Sequence order in the gallery stream. |

---

### 5.12 `media_mentions.csv` — Press, TV & News Features
*Powers TV interview cards, press coverage, and newspaper clipping previews on the Homepage and Blog.*

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
| `is_featured` | No | Boolean | `true` | Set to `true` to highlight on Homepage. |

---

### 5.13 `news.csv` — Monthly Announcements & Updates
*Powers the Latest News & Announcements widget on the Homepage.*

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
| `is_featured` | No | Boolean | `true` | Show in Homepage News section. |
| `sort_order` | No | Integer | `1` | Priority order. |

---

### 5.14 `upcycling.csv` — Sustainability & Craft Projects
*Powers the Upcycling and Creative Craft portfolio items.*

| Column | Required? | Type | Example | Description |
|---|---|---|---|---|
| `id` | **Yes** | String/Int | `1` | Unique identifier. |
| `title` | **Yes** | String | `Geometric Lamp Shade from Recycled Cardboard` | Craft project title. |
| `description` | No | String | `Made from recycled cardboard and wooden rulers...` | Overview of materials and process. |
| `image_url` | No | Path/URL | `/images/up_1.jpeg` | Photo of the creation. |
| `instagram_link` | No | URL | `https://instagram.com/p/...` | Instagram post or video link. |
| `display_order` | No | Integer | `1` | Display order. |

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

The repository includes a validation script (`scripts/validateData.js`) that automatically checks all 14 CSV files for:
- Unique `id` values with zero duplicates.
- All required columns present and non-empty.
- Valid boolean values (`true` or `false`).
- Valid numeric formats (`year`, `display_order`, `featured_order`, `sort_order`).

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
| `❌ Invalid boolean value for "is_featured": "yes"` | Value must be `true` or `false`. | Replace `"yes"` with `"true"`. |
| `❌ Invalid numeric value for "year": "2024-05"` | `year` column received a date string instead of a 4-digit number. | Change value to `2024`. Use the `date` column for full `YYYY-MM-DD` dates. |
| Broken image on live site | Typo in file name or missing image file. | Check `public/images/` to confirm the exact filename and case sensitivity (e.g. `.jpg` vs `.jpeg`). |
| Card links not clicking properly | Malformed syntax in `sources` or `links`. | Ensure links use `type:url|Label` format separated by ` ; `. |
