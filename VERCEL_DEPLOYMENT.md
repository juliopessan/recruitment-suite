# Deployment Guide - Vercel

Complete guide for deploying the Recruitment Suite frontend to Vercel.

## Prerequisites

- [Vercel Account](https://vercel.com) (free)
- [GitHub Account](https://github.com)
- Repository pushed to GitHub
- Vercel CLI (optional but recommended)

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Push Code to GitHub

```bash
cd /home/user/recruitment-suite
git remote add github https://github.com/your-username/recruitment-suite.git
git push -u github main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select **"recruitment-suite"**

### Step 3: Configure Build Settings

**Project Name:** `recruitment-suite-frontend` (or your choice)

**Framework Preset:** `Vite`

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

**Environment Variables:**

```
VITE_API_URL=https://your-backend-api.vercel.app
VITE_API_BASE_PATH=/api
```

### Step 4: Deploy

Click **"Deploy"** and wait for build to complete.

**Result:** Your app will be live at `https://recruitment-suite-frontend.vercel.app`

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### Step 3: Deploy Frontend

```bash
cd /home/user/recruitment-suite/frontend
vercel
```

**Questions and answers:**

```
? Set up and deploy "./frontend"? yes
? Which scope do you want to deploy to? [your-username]
? Link to existing project? no
? What's your project's name? recruitment-suite-frontend
? In which directory is your code? ./
? Want to modify these settings? no
? Environment Variables? (leave empty for now)
```

### Step 4: Set Environment Variables

```bash
vercel env add VITE_API_URL
# Enter: https://your-backend-api.vercel.app

vercel env add VITE_API_BASE_PATH
# Enter: /api
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## Backend Deployment (FastAPI)

### Deploy Backend to Render or Railway

#### Option A: Render (Free Tier Available)

1. Go to [render.com](https://render.com)
2. Create account and sign in
3. Click **"New +"** → **"Web Service"**
4. Connect GitHub repository
5. Configure:
   - **Name:** `recruitment-suite-api`
   - **Environment:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.api:app`
   - **Free Tier:** Yes
6. Deploy

#### Option B: Railway (Free Tier)

1. Go to [railway.app](https://railway.app)
2. Create account and connect GitHub
3. Create new project
4. Deploy `recruitment-suite`
5. Configure environment variables
6. Railway auto-detects Python and deploys

#### Option C: Heroku Alternative

Since Heroku free tier was retired, use Render or Railway.

---

## Configuration for Production

### Frontend (Vercel)

Create `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-api.vercel.app
VITE_API_BASE_PATH=/api
VITE_LOG_LEVEL=error
VITE_ENABLE_ANALYTICS=true
```

### Backend (FastAPI)

Create `.env.production`:

```env
DATABASE_URL=postgresql://user:password@db.provider.com/recruitment_suite
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=False
CORS_ORIGINS=["https://recruitment-suite-frontend.vercel.app"]
```

---

## Database Setup

### Option 1: PostgreSQL Cloud (Free)

Use one of:
- **ElephantSQL** (free tier)
- **Supabase** (free tier)
- **Railway PostgreSQL** (free tier)

**Steps:**

1. Create account and database
2. Get connection string
3. Set in backend `.env`:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```
4. Initialize schema (first run)

### Option 2: Keep SQLite (Development)

For testing, SQLite works but not recommended for production.

---

## Continuous Deployment

After initial setup, every push to `main` triggers automatic deployment:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

✅ Vercel automatically rebuilds and redeploys frontend  
✅ Backend redeploys (if using Render/Railway with auto-deploy enabled)

---

## Verify Deployment

### Frontend

```bash
curl https://recruitment-suite-frontend.vercel.app/
# Should return HTML
```

### Backend

```bash
curl https://your-backend-api.vercel.app/health
# Should return: {"status": "ok", "version": "1.0.0"}
```

### Full Integration Test

1. Open frontend URL in browser
2. Login with any credentials
3. Try creating a candidate
4. API should store in cloud database

---

## Troubleshooting

### Build Fails on Vercel

**Check build logs:**
- Vercel Dashboard → Project → Deployments → Failed build → View Logs

**Common issues:**

```
Error: Cannot find module
→ Solution: npm install before build

Error: TypeScript errors
→ Solution: Fix type errors or run: npm run type-check locally

Error: Out of memory
→ Solution: Increase build memory in vercel.json
```

### API Connection Issues

**Frontend can't reach backend:**

1. Check `VITE_API_URL` environment variable
2. Verify backend is running and accessible
3. Check CORS configuration
4. Test with curl: `curl $VITE_API_URL/health`

### Database Connection Failed

**Backend can't reach database:**

1. Verify `DATABASE_URL` in `.env`
2. Check IP whitelist in database settings
3. Test connection: `psql $DATABASE_URL`

---

## Scaling & Optimization

### Frontend
- ✅ Vercel handles scaling automatically
- ✅ Content cached at edge globally
- ✅ Automatic HTTPS and CDN

### Backend
- **Render/Railway:** Scale CPU/RAM as needed
- **Database:** Consider managed PostgreSQL service
- **Monitor:** Use service dashboards for performance

---

## Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel Frontend | ✅ Yes | $20+/mo |
| Render Backend | ✅ Yes (limited) | $12+/mo |
| Railway | ✅ Yes ($5 credit) | Pay-as-you-go |
| Supabase PostgreSQL | ✅ Yes (500MB) | $25+/mo |
| **Total** | **~$0** | **$57+/mo** |

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database created and tested
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and loads
- [ ] API connection working
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic)
- [ ] Custom domain (optional)
- [ ] Monitoring/logging setup
- [ ] Backup strategy for database

---

## Quick Start Command

```bash
# Terminal 1: Deploy frontend
cd /home/user/recruitment-suite/frontend
vercel --prod

# Terminal 2: Deploy backend (to Render/Railway via GitHub)
# Use their web interface or CLI
```

---

## Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Supabase Docs](https://supabase.com/docs)

---

**Status:** Ready for Production Deployment ✅  
**Last Updated:** 2026-07-08
