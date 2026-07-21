# Portfolio + Blog (Angular · GitHub Pages)

Personal **BlogWithCodes** portfolio landing page and **HTML-driven blog**, ready to host on GitHub Pages.

## Stack

- Angular 22 (standalone components, lazy routes)
- Tailwind CSS v4
- HTML posts under `public/content/posts/`
- Deploy with `angular-cli-ghpages` or GitHub Actions

## Quick start

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Add a new blog post

1. Create `public/content/posts/my-new-post.html`
2. Add metadata to `public/content/posts/index.json`:

```json
{
  "slug": "my-new-post",
  "title": "My new post",
  "excerpt": "One-line summary.",
  "category": "csharp",
  "tags": ["dotnet"],
  "date": "2026-07-21",
  "readingTime": "5 min",
  "cover": "assets/blog/my-new-post/01.png"
}
```

Optional: set `"draft": true` to keep the post out of lists/home while still allowing `/blog/my-new-post` by direct URL.

3. Put images under `public/assets/blog/<slug>/` and reference them as `assets/blog/<slug>/…` in HTML and cover.

4. Commit and push to `main` (and deploy).

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
  "slug": "triund",
  "name": "Triund",
  "region": "Kangra, Himachal Pradesh",
  "country": "India",
  "visitedOn": "2025-05-17",
  "type": "trek",
  "summary": "Short summary",
  "notes": "Your trail notes — how you reached it and how the trek went",
  "photo": "assets/places/triund.jpg",
  "photoCredit": "Your photo"
}
```

Blog covers and inline images live under `public/assets/blog/<slug>/` and are referenced as `assets/blog/<slug>/…`.

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

Content is driven by JSON/HTML under `public/content/`. Draft posts use `"draft": true` in `posts/index.json`.
