# Netflux

Stream movies & TV trailers — React app powered by TMDB.

## Do not open `index.html` directly

The file in the project root is only a **template**. Browsers need the **built** version.

| Wrong | Right |
|-------|--------|
| Double-click `index.html` | Run `npm run dev` → http://localhost:5173 |
| Push only source to GitHub | Use GitHub Actions (below) to publish `dist/` |

After `npm run build`, open `dist/index.html` via `npm run preview` — that folder has all JS/CSS **embedded as bundled files** linked from `index.html`.

---

## Publish on GitHub Pages (free hosting)

### 1. Push code to GitHub

Create a repo (e.g. `netflic-clone`) and push this project.

### 2. Add TMDB token (required for movies to load)

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `VITE_TMDB_ACCESS_TOKEN`
4. Value: your [TMDB API Read Access Token](https://www.themoviedb.org/settings/api)

### 3. Enable GitHub Pages

1. **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**

### 4. Deploy

Push to `main` (or `master`). The workflow `.github/workflows/deploy.yml` will:

- Build the app (`vite build`)
- Bundle everything into `dist/` (HTML + JS + CSS + images)
- Publish to GitHub Pages

Your site will be live at:

`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

Example: `https://hemanth04.github.io/netflic-clone/`

---

## Local development

```bash
npm install
```

Create `.env`:

```env
VITE_TMDB_ACCESS_TOKEN=your_token_here
```

```bash
npm run dev
```

## Local production test (same as GitHub Pages)

```bash
npm run build
npm run preview
```

Open the URL shown (e.g. http://localhost:4173).

---

## Project structure

```
index.html          → dev entry (Vite transforms this)
src/                → React source code
public/             → static files (logo, favicon) → copied to dist/
dist/               → built site (this is what GitHub Pages serves)
.github/workflows/  → auto-deploy on push
```
