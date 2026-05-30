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

## Publish on GitHub Pages

**Quick deploy (recommended):**

```powershell
gh auth login
cd "d:\frontend\netflic clone"
.\scripts\deploy-github.ps1
```

Then enable **Settings → Pages → GitHub Actions**. See **DEPLOY.md** for details.

Live URL: `https://hemanth04.github.io/netflux/`

The workflow `.github/workflows/deploy.yml` builds `dist/` and publishes it on every push to `main`.

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
