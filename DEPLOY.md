# Deploy Netflux to GitHub Pages

Everything is ready in this repo. You only need to **log in to GitHub once**, then run one script.

## Step 1 — Log in to GitHub (one time)

Open PowerShell and run:

```powershell
gh auth login
```

Choose: **GitHub.com** → **HTTPS** → **Login with browser**

## Step 2 — Deploy

```powershell
cd "d:\frontend\netflic clone"
.\scripts\deploy-github.ps1
```

This script will:

1. Create repo `hemanth04/netflux` (public) if it does not exist  
2. Push your code to `main`  
3. Save your TMDB token as a GitHub Actions secret  
4. Trigger the build → your site goes live  

## Step 3 — Enable GitHub Pages (one time)

1. Open https://github.com/hemanth04/netflux/settings/pages  
2. **Build and deployment** → Source: **GitHub Actions**  
3. Wait 2–3 minutes for the workflow to finish  

## Your live URL

**https://hemanth04.github.io/netflux/**

---

## Manual alternative (no GitHub CLI)

1. Create a new repo on https://github.com/new named `netflux`  
2. Run:

```powershell
cd "d:\frontend\netflic clone"
git remote add origin https://github.com/YOUR_USERNAME/netflux.git
git push -u origin main
```

3. Settings → Secrets → add `VITE_TMDB_ACCESS_TOKEN`  
4. Settings → Pages → Source: **GitHub Actions**
