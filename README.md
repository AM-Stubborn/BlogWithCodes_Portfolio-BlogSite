# Portfolio + Blog (Angular · GitHub Pages)

Demo template for a personal **portfolio landing page** and a **markdown-driven blog**, ready to host on GitHub Pages.

## Stack

- Angular 22 (standalone components, lazy routes)
- Tailwind CSS v4
- Markdown posts via `marked`
- Deploy with `angular-cli-ghpages` or GitHub Actions

## Quick start

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Add a new blog post

1. Create `public/content/posts/my-new-post.md`
2. Add metadata to `public/content/posts/index.json`:

```json
{
  "slug": "my-new-post",
  "title": "My new post",
  "excerpt": "One-line summary.",
  "category": "engineering",
  "tags": ["angular"],
  "date": "2026-07-21",
  "readingTime": "5 min",
  "cover": ""
}
```

3. Commit and push to `main` (and deploy).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Portfolio landing |
| `/projects` | Projects catalog |
| `/projects/:slug` | Project detail |
| `/blog` | All posts |
| `/blog/category/:category` | Posts by category |
| `/blog/:slug` | Single post |
| `/places` | Places visited journal |
| `/places/:slug` | Single place + photo |

## Places visited (trek journal)

Each place is one object in `public/content/places.json` with **one photo** under `public/assets/places/`.

```json
{
  "slug": "triund-trek",
  "name": "Triund Trek",
  "region": "Himachal Pradesh",
  "country": "India",
  "visitedOn": "2024-10-12",
  "type": "trek",
  "summary": "Short summary",
  "notes": "Your trail notes",
  "photo": "assets/places/triund-trek.jpg",
  "photoCredit": "Your photo"
}
```

Blog covers live under `public/assets/blog/` and are referenced from `public/content/posts/index.json` via `"cover": "assets/blog/my-post.jpg"`.

Routes: `/places` and `/places/:slug`.

## Deploy to GitHub Pages

### Option A — CLI (manual)

1. Update the base href in `package.json` → `build:ghpages` to match your repo name:

```text
--base-href=/YOUR_REPO_NAME/
```

2. Run:

```bash
npm run deploy
```

3. In the GitHub repo: **Settings → Pages → Deploy from branch `gh-pages` / root**.

### Option B — GitHub Actions

Push to `main`. The workflow in `.github/workflows/deploy-github-pages.yml` builds and publishes automatically.

Set the `BASE_HREF` env in that workflow to `/YOUR_REPO_NAME/` (or `/` for a `username.github.io` user site).

## Project layout

```text
public/content/     ← edit content here (no rebuild logic required beyond deploy)
src/app/
  core/             ← models + services
  layout/           ← header / footer
  pages/            ← home, blog list, blog post, 404
  shared/           ← reusable UI
```

## Notes for later personalization

This is intentionally filled with **demo** copy (Alex Rivera). When you send your real details, we can swap content, branding, and colors without changing the architecture.
