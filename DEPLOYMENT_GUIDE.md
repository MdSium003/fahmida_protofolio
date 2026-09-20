# GitHub Pages Deployment Guide

> **Live Production URL:** [https://mdsium003.github.io/fahmida_protofolio/](https://mdsium003.github.io/fahmida_protofolio/)  
> **Repository:** `mdsium003/fahmida_protofolio`  
> **CI/CD Workflow:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---

## 1. Overview: How Deployment Works

All deployment automation has **already been fully configured and wired up**.

Every time you commit and push changes to the **`main`** branch on GitHub:
1. GitHub automatically triggers the **Deploy to GitHub Pages** GitHub Actions workflow.
2. The workflow checks out your code, sets up Node.js 22, and runs `npm ci`.
3. It runs `npm run lint` and `npm run validate:data` to guarantee that your code and all 14 CSV data files are 100% error-free.
4. It compiles an optimized production bundle with Vite into `dist/`.
5. It uploads the bundle and publishes it directly to GitHub Pages CDN.
6. Your live site updates automatically in **under 60 seconds**.

---

## 2. Step-by-Step Deployment Instructions

Deploying new content, research papers, projects, or code changes requires only **3 simple steps**:

```
 ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
 │  1. Local Validation │ ───► │  2. Git Commit & Push│ ───► │ 3. GitHub Auto-Deploy│
 │  npm run build       │      │  git push origin main│      │ Live in ~60 seconds  │
 └──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

---

### Step 1: Validate & Test Locally (Recommended)

Before pushing to GitHub, ensure that your data and code pass all automated checks. Run these commands in your project terminal:

```bash
# 1. Check that all CSV data files are valid and error-free
npm run validate:data

# 2. Check for any linting errors
npm run lint

# 3. Test the production build locally
npm run build
```

If all three commands finish successfully (green output), you are ready to deploy!

---

### Step 2: Commit and Push Your Changes

Stage your changed files, write a clear commit message, and push to GitHub:

```bash
# Check modified files
git status

# Stage your CSV files, images, or code changes
git add .

# Commit with a descriptive message
git commit -m "Update portfolio: add new research paper and awards"

# Push to the main branch on GitHub
git push origin main
```

---

### Step 3: Monitor the Live Deployment

1. Open your repository on GitHub:  
   **[https://github.com/mdsium003/fahmida_protofolio](https://github.com/mdsium003/fahmida_protofolio)**
2. Click on the **Actions** tab at the top.
3. You will see a workflow run named **Deploy to GitHub Pages** with a yellow spinning circle (indicating that it is building).
4. In about 45–60 seconds, the status will turn into a **green checkmark (Success)**.
5. Open your live site:  
   **[https://mdsium003.github.io/fahmida_protofolio/](https://mdsium003.github.io/fahmida_protofolio/)**

> [!TIP]
> If you don't see your changes immediately on your live website, perform a **hard refresh** in your browser by pressing **`Ctrl + F5`** (Windows) or **`Cmd + Shift + R`** (Mac) to bypass browser cache.

---

## 3. How to Trigger Deployment Manually (Without Committing Code)

If you ever need to re-deploy the site without making new code changes (e.g., after updating repository settings):

1. Go to your repository on GitHub: `https://github.com/mdsium003/fahmida_protofolio`.
2. Click on the **Actions** tab.
3. In the left sidebar, click on **Deploy to GitHub Pages**.
4. Click the **Run workflow** dropdown on the right.
5. Select branch: `main` and click the green **Run workflow** button.

---

## 4. One-Time GitHub Settings Verification

The repository is already configured to deploy using GitHub Actions. If you ever need to verify or recreate this setting on a new fork or repository:

1. In your GitHub repository, click **Settings** (top menu bar).
2. In the left sidebar under *Code and automation*, click **Pages**.
3. Under **Build and deployment**:
   - **Source:** Select **`GitHub Actions`** (do *not* select "Deploy from a branch").
4. That's it! GitHub will now use `.github/workflows/deploy.yml` for all deployments.

```
 GitHub Repository Settings
 └── Pages
     └── Build and deployment
         └── Source: [ GitHub Actions ▼ ]
```

---

## 5. Under the Hood: The GitHub Actions Workflow

The CI/CD pipeline is defined in [`.github/workflows/deploy.yml`](file:///d:/Git/Temp_fahmida/fahmida_protofolio/.github/workflows/deploy.yml):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: pages
  cancel-in-progress: false

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Build
        run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Why This Pipeline is Robust:
- **`npm ci`:** Installs exact versions from `package-lock.json` for deterministic, reproducible builds.
- **Blocking Linter (`npm run lint`):** Ensures no syntax regressions or broken imports reach production.
- **Pre-Build Data Validator (`scripts/validateData.js`):** Runs automatically as part of `npm run build`. If any CSV contains a duplicate ID or missing required column, the build aborts before publishing broken HTML.
- **Concurrency Protection:** Ensures only one deployment runs at a time so that a half-published build is never served.

---

## 6. How to Deploy to a Custom Domain (Optional Future Step)

If you ever purchase a custom domain (such as `https://fahmidasultana.me` or `https://fahmida.dev`), follow these simple steps to point the portfolio to your domain:

### Step 1: Update `vite.config.js`
Change the base URL from the sub-path `/fahmida_protofolio/` to root `/`:
```javascript
// vite.config.js
const BASE = '/';
```

### Step 2: Add a `public/CNAME` File
Create a new file at `public/CNAME` containing your custom domain name:
```
fahmidasultana.me
```

### Step 3: Update Domain URLs in Static Metadata Files
Update the full domain in:
- `index.html` (`canonical`, `og:url`, `og:image`, `twitter:image`)
- `public/robots.txt`
- `public/sitemap.xml`
- `public/site.webmanifest`
- `public/404.html`

### Step 4: Configure DNS Records
At your domain registrar (Namecheap, Cloudflare, GoDaddy), add GitHub Pages DNS records:
- **A Records:**
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **CNAME Record:** `www` pointing to `mdsium003.github.io`.

### Step 5: Push to GitHub
```bash
git add .
git commit -m "Configure custom domain fahmidasultana.me"
git push origin main
```

---

## 7. Troubleshooting Deployment Failures

### 1. Build Failed on GitHub Actions (Red Cross ❌)
1. Go to the **Actions** tab on GitHub.
2. Click on the failed workflow run.
3. Click on the **build** job to open the step-by-step logs.
4. Expand the step that has a red indicator:
   - **If `Build` failed with data errors:** Look for the message `💥 DATA VALIDATION FAILED`. It will state which CSV file and row has a duplicate ID or missing column. Fix the CSV locally, validate with `npm run validate:data`, and push again.
   - **If `Lint` failed:** It will show the exact file and line with an ESLint error. Fix it locally, verify with `npm run lint`, and push.

### 2. 404 Error When Refreshing a Subpage (e.g. `/research`)
The site handles Single Page Application routing via `public/404.html` and `src/spaRestore.js`. If you encounter a 404 on refresh:
- Ensure that `public/404.html` exists in your repository.
- Ensure that `base` in `vite.config.js` matches your repository sub-path (`/fahmida_protofolio/`).

### 3. Images Not Loading on Live Site
- Check the casing of the image filename. GitHub Pages runs on Linux servers where file paths are **case-sensitive** (e.g. `/images/Photo.JPG` is different from `/images/photo.jpg`).
- Ensure the image path in the CSV starts with a forward slash: `/images/filename.jpg`.
