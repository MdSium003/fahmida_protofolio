# 📊 Portfolio CSV Data Guide

All portfolio content is stored in **10 clean, self-contained CSV files** located in this directory (`public/data/`). You can easily open, edit, add, or delete items using **Microsoft Excel**, **Google Sheets**, or any spreadsheet/text editor.

---

## 📁 Overview of Files

| CSV File | Section on Website | Description |
| :--- | :--- | :--- |
| **`media_mentions.csv`** | Blog Key Moments & Homepage DriftWall | TV channel interviews, newspaper features, Facebook spotlights, video embeds |
| **`moments.csv`** | Blog Key Moments & Homepage DriftWall | Journey photos and milestone snapshots |
| **`projects.csv`** | Projects & Homepage Showcase | Engineering & software projects, featured carousel items, code links |
| **`research.csv`** | Research Papers | Academic papers, publications, abstracts, authors, topics |
| **`awards.csv`** | Awards & Achievements | Honors, competitions, certificates, photos, videos |
| **`blogs.csv`** | Blog & Vlogs | Articles, video logs, links, gallery media |
| **`skills.csv`** | Skills & Expertise | Programming languages (with % score), frameworks, tools |
| **`experience.csv`** | Experience & Career Timeline | Work experience, job titles, companies, dates, descriptions |
| **`education.csv`** | Education & Career Timeline | Degrees, institutions, GPA, clubs, achievements |
| **`volunteer.csv`** | Volunteer & Career Timeline | Community work, leadership roles, responsibilities |
| **`social_links.csv`** | Homepage & Footer | Social media profiles, resume/CV link |
| **`upcycling.csv`** | Upcycling Projects | Creative craft & DIY upcycling portfolio items |
| **`news.csv`** | Homepage News & Milestones | Monthly news updates and announcements |

---

## 🛠️ File Schemas & Examples

### 1. `projects.csv`
Used in the **Projects page** and the **Homepage 3D Showcase Carousel**.
- **`id`**: Unique numeric identifier (e.g., `1`, `2`, `3`).
- **`title`**: Project title.
- **`thumbnail_url`**: Image URL or YouTube URL.
- **`description`**: Project summary or details.
- **`presented_in`**: Event/competition/organization where it was presented.
- **`presented_in_url`**: Link to event or conference website.
- **`year`**: Year (e.g., `2024`).
- **`keywords`**: Comma-separated tags (e.g., `Computer Vision, 3D Reconstruction, AI`).
- **`is_featured`**: Set to `true` to showcase this project on the Homepage carousel, `false` otherwise.
- **`featured_order`**: Display order on the Homepage carousel (e.g., `1`, `2`, `3`).
- **`sources`**: Links formatted with type and optional label separated by ` ; `.
  * Example: `github:https://github.com/farhan5384/|Source Code ; live_demo:https://example.com|Live Demo ; video:https://youtu.be/...|Preview Video`

---

### 2. `research.csv`
Used in the **Research page**.
- **`id`**: Unique numeric ID.
- **`title`**: Research paper title.
- **`thumbnail_url`**: Thumbnail image URL.
- **`description`**: Conference / journal publication info or short summary.
- **`abstract`**: Full paper abstract.
- **`status`**: Publication status (`published`, `preprint`, `under_review`).
- **`award`**: Any award won (e.g., `Best Paper Award`, `Runner Up`), or leave blank.
- **`year`**: Publication year (e.g., `2025`).
- **`topics`**: Comma-separated research topics (e.g., `LLM, Multi-Agent Reasoning, Computer Vision`).
- **`authors`**: Authors separated by ` ; `. Format: `Author Name|github_url|website_url`.
  * Example: `Fahmida Hossain|https://github.com/fahmidahossain|https://fahmida.dev ; Dr. Jane Doe||https://janedoe.com`
- **`links`**: Links separated by ` ; `. Format: `type:url` (e.g., `paper:https://arxiv.org/... ; code:https://github.com/...`).
- **`media`**: Gallery images/videos separated by ` ; `. Format: `image:https://...` or `youtube:https://...`.

---

### 3. `awards.csv`
Used in the **Awards page**.
- **`id`**: Unique numeric ID.
- **`title`**: Award name & title.
- **`thumbnail_url`**: Main award badge / certificate / ceremony picture.
- **`organization_name`**: Awarding organization (e.g., `NASA Space Apps`, `Dhaka University`).
- **`organization_url`**: Website of the awarding organization.
- **`description`**: Description of what the award was for.
- **`topic`**: Category name for filtering (e.g., `CS Competitions`, `Writing Competitions`, `Science Fairs`, `Extra Curricular`).
- **`year`**: Year awarded (e.g., `2024`).
- **`media`**: Extra certificate photos or videos separated by ` ; `.
  * Example: `image:https://... ; youtube:https://youtu.be/...`

---

### 4. `blogs.csv`
Used in the **Blog / Vlog page**.
- **`id`**: Unique numeric ID.
- **`title`**: Blog / Vlog title.
- **`thumbnail_url`**: Main banner image or video.
- **`description`**: Blog excerpt / content text.
- **`published_date`**: Date formatted as `YYYY-MM-DD` (e.g., `2026-02-10`).
- **`links`**: Links formatted as `type:url|label` separated by ` ; `.
- **`media`**: Additional gallery items formatted as `media_type:url|caption` separated by ` ; `.
  * Example: `youtube:https://youtu.be/...|Vlog Video ; image:https://...|Event Photo`

---

### 5. `skills.csv`
Used in the **Skills page**.
- **`id`**: Unique ID (e.g., `lang_1`, `frame_1`, `tool_1`).
- **`category`**: One of `Languages`, `Frameworks`, or `Tools`.
- **`name`**: Skill name (e.g., `Python`, `React`, `Unity`, `Docker`).
- **`proficiency`**:
  * For **Languages**: Numeric percentage (e.g., `90` for 90%).
  * For **Frameworks**: Sub-category (e.g., `Machine Learning`, `Frontend`).
  * For **Tools**: Tool category (e.g., `Game Engine`, `Version Control`).
- **`display_order`**: Numeric sorting order (`1`, `2`, `3`...).

---

### 6. `experience.csv`
Used in the **Experience & Career pages**.
- **`id`**: Unique numeric ID.
- **`job_title`**: Role title (e.g., `Senior Human Resources Coordinator`).
- **`company`**: Company / organization name.
- **`location`**: Location (e.g., `Dhaka, Bangladesh`).
- **`start_date`**: Start date (`YYYY-MM-DD`).
- **`end_date`**: End date (`YYYY-MM-DD` or empty if current).
- **`employment_type`**: `Full-time`, `Part-time`, `Internship`, etc.
- **`description`**: Bullet points or role overview.
- **`skills_used`**: Comma-separated list of skills used.
- **`external_link`**: Company URL.
- **`logo_url`**: Company logo image URL.

---

### 7. `education.csv`
Used in the **Education & Career pages**.
- **`id`**: Unique numeric ID.
- **`institution`**: University or college name.
- **`degree_level`**: `BSc`, `College`, `School`, `MS`, `PhD`.
- **`field_of_study`**: Major / field (e.g., `Computer Science & Engineering`).
- **`start_year`**: Start year (e.g., `2020`).
- **`end_year`**: Graduation year (e.g., `2024`).
- **`grade`**: GPA / CGPA / Honors.
- **`activities`**: Extracurricular activities, societies, achievements during study.
- **`skills`**: Relevant skills learned.
- **`external_link`**: Institution website link.
- **`logo_url`**: Institution logo image URL.

---

### 8. `volunteer.csv`
Used in the **Volunteer & Career pages**.
- **`id`**: Unique numeric ID.
- **`role`**: Volunteer role title.
- **`organization`**: Non-profit or community organization name.
- **`start_date`**: Start date (`YYYY-MM-DD`).
- **`end_date`**: End date (`YYYY-MM-DD`).
- **`duration`**: Display duration text (e.g., `2 yrs 9 mos`).
- **`category`**: Category (e.g., `Education`, `Community`, `Environment`).
- **`description`**: Overview of volunteering activities.
- **`responsibilities`**: Specific responsibilities and tasks handled.
- **`skills_gained`**: Skills gained.
- **`external_link`**: Organization website.
- **`logo_url`**: Organization logo image URL.

---

### 9. `social_links.csv`
Used in the **Homepage Hero** and **Footer**.
- **`id`**: Unique numeric ID.
- **`platform`**: `github`, `linkedin`, `facebook`, `instagram`, `researchgate`, `cv`.
- **`url`**: Direct profile URL or link to PDF resume.
- **`icon`**: Icon identifier (`github`, `linkedin`, `facebook`, `instagram`, `researchgate`, `file-text`).
- **`sort_order`**: Numeric sort order (`1`, `2`, `3`...).

---

### 10. `upcycling.csv`
Used in the **Upcycling Projects page**.
- **`id`**: Unique numeric ID.
- **`title`**: Project title.
- **`description`**: Description of materials and process.
- **`image_url`**: Photo of the upcycled creation.
- **`instagram_link`**: Instagram post link or social media post.
- **`display_order`**: Sorting order.

---

### 11. `media_mentions.csv`
Used in the **Blog Key Moments Section** and **Homepage DriftWall**.
- **`id`**: Unique numeric ID (e.g., `1`, `2`, `3`).
- **`title`**: Headline / Feature title (e.g., `Channel 24 Exclusive Interview`).
- **`outlet`**: Media outlet name (e.g., `Channel 24`, `The Daily Star`, `Prothom Alo`, `Somoy TV`, `Facebook`).
- **`media_type`**: `tv`, `newspaper`, `facebook`, `youtube`, or `article`.
- **`image_url`**: Thumbnail, screenshot, or newspaper clipping photo path (e.g., `/wall/ddn.jpeg` or external URL).
- **`media_url`**: Direct YouTube video link (e.g., `https://www.youtube.com/watch?v=...`) or video file.
- **`external_link`**: Published article URL, portal link, or Facebook post URL (e.g., `https://thedailystar.net/...`).
- **`date`**: Date formatted as `YYYY-MM-DD` (e.g., `2026-02-18`).
- **`caption`**: Detailed summary / description of the broadcast or article.
- **`display_order`**: Sorting order (`1`, `2`, `3`...).
- **`is_featured`**: `true` or `false`.

---

## 💡 Quick Tips for Editing
1. **Adding a new item:** Simply add a new row at the bottom with a new `id`.
2. **Multiple links or media items:** Separate multiple items with a semicolon ` ; `.
3. **Empty fields:** If an item doesn't have an optional field (like `award` or `external_link`), leave that column blank.
4. **Instant Update:** After editing and saving the CSV file, refresh the browser page to see your updates live!
