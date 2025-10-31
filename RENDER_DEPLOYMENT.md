# Render Deployment Guide

Step-by-step guide to deploy the MBTI application to Render.com using PostgreSQL.

## Prerequisites

- ✅ GitHub account with your code pushed to a repository
- ✅ Render.com account (sign up at https://render.com - free tier available)
- ✅ Application is ready with PostgreSQL (already migrated)

---

## Step 1: Create PostgreSQL Database on Render

1. **Log in to Render Dashboard**
   - Go to https://dashboard.render.com
   - Sign in or create a free account

2. **Create PostgreSQL Database**
   - Click "New +" button (top right)
   - Select "PostgreSQL"
   
3. **Configure Database**
   - **Name**: `hkmbti-postgres` (or your preferred name)
   - **Database**: `mbti_db`
   - **User**: `mbti_user` (auto-generated, you can change)
   - **Region**: Choose closest to your location (e.g., `Singapore`, `Oregon`)
   - **PostgreSQL Version**: `15` (recommended)
   - **Plan**: `Free` (512 MB storage - perfect for <100 visits/day)
   - Click "Create Database"

4. **Save Connection String**
   - Wait for database to be provisioned (takes ~1-2 minutes)
   - Once ready, go to database dashboard
   - Copy the **Internal Database URL** (looks like):
     ```
     postgresql://mbti_user:password123@dpg-xxxxx-a.singapore-postgres.render.com/mbti_db
     postgresql://mbti_user:shBtyWdVrnDidENlA08pXTVR8b6pBryP@dpg-d427gr49c44c73858cgg-a/mbti_db_66ih
     ```
   - **Important**: Keep this URL safe - you'll need it for backend deployment
   - Also note the **External Connection String** if you need to connect from outside Render

---

## Step 2: Deploy Backend API

1. **Create Web Service**
   - In Render dashboard, click "New +"
   - Select "Web Service"
   - Connect your GitHub account if not already connected
   - Select your repository: `hkmbti` (or your repo name)

2. **Configure Backend Service**
   - **Name**: `hkmbti-backend`
   - **Environment**: `Node`
   - **Region**: Choose same region as your PostgreSQL database
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (512 MB RAM - sufficient for low traffic)

3. **Set Environment Variables**
   Click "Add Environment Variable" and add:
   
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   JWT_SECRET=<generate-a-random-secret-key>
   DB_LOGGING=false
   ```
   
   **To generate JWT_SECRET**, run in terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
   Or use an online generator: https://www.guidgenerator.com/online-guid-generator.aspx

4. **Add Optional Environment Variables** (if needed):
   ```
   GROK_API_KEY=your-grok-api-key (if using AI features)
   ```

5. **Create Service**
   - Click "Create Web Service"
   - Render will start building and deploying
   - Wait for deployment to complete (~5-10 minutes first time)
   - Note the backend URL: `https://hkmbti-backend.onrender.com`

---

## Step 3: Deploy Frontend

1. **Create Another Web Service**
   - Click "New +" → "Web Service"
   - Select the same GitHub repository

2. **Configure Frontend Service**
   - **Name**: `hkmbti-frontend`
   - **Environment**: `Static Site` (recommended) OR `Node`
   
   **Option A: Static Site (Recommended - Faster, Simpler)**
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Instance Type**: `Free`
   
   **Option B: Node Service (If you need server-side features)**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build && npm install -g serve`
   - **Start Command**: `serve -s build -l 3000`
   - **Instance Type**: `Free`

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://hkmbti-backend.onrender.com
   NODE_ENV=production
   ```
   
   **Important**: Replace `hkmbti-backend.onrender.com` with your actual backend service URL

4. **Create Service**
   - Click "Create Web Service"
   - Wait for deployment (~5-10 minutes)
   - Note the frontend URL: `https://hkmbti-frontend.onrender.com`

---

## Step 4: Update CORS Configuration

After both services are deployed, update backend CORS to allow your frontend URL:

1. **Go to Backend Service Settings**
   - Navigate to your backend service
   - Go to "Environment" tab
   - Add or update:

   ```
   FRONTEND_URL=https://hkmbti-frontend.onrender.com
   ```

2. **Update Backend Code** (if needed)
   If your CORS config doesn't use the environment variable, update `backend/server.js`:
   
   ```javascript
   app.use(cors({
     origin: [
       process.env.FRONTEND_URL || 'https://hkmbti-frontend.onrender.com',
       // ... other origins
     ],
     // ...
   }));
   ```

3. **Redeploy Backend**
   - Render will auto-redeploy when you push changes
   - Or manually trigger: "Manual Deploy" → "Deploy latest commit"

---

## Step 5: Verify Deployment

1. **Check Backend Health**
   - Visit: `https://hkmbti-backend.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"MBTI API is running"}`
   - If first request is slow (~30 seconds), that's normal (service was spinning up)

2. **Check Frontend**
   - Visit: `https://hkmbti-frontend.onrender.com` (or your static site URL)
   - Should load the application homepage
   - Check browser console (F12) for any API connection errors

3. **Test Full Flow**
   - Create a new test session
   - Submit some responses
   - Calculate result
   - Verify data is saved in PostgreSQL

4. **Check Logs** (if issues)
   - In Render dashboard, go to service → "Logs" tab
   - Look for errors or warnings
   - Backend should show: `✅ Connected to PostgreSQL database`
   - Backend should show: `✅ Database synchronized`

---

## Step 6: Database Tables Creation

The application will automatically create tables on first startup:

1. **Check Backend Logs**
   - Go to backend service → "Logs"
   - Look for: `✅ Connected to PostgreSQL database`
   - Look for: `✅ Database synchronized`
   - Look for: `✅ Created GIN index on results.demographics` (if applicable)

2. **Verify Tables** (Optional)
   - You can connect to your database using Render's built-in database browser
   - Or use a PostgreSQL client with the External Connection String

---

## Step 7: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - In Render dashboard, go to your frontend service
   - Click "Settings" → "Custom Domains"
   - Add your domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - Update `REACT_APP_API_URL` if needed
   - Update backend CORS settings

---

## Troubleshooting

### Backend Won't Start
- ✅ Check environment variables are set correctly
- ✅ Verify `DATABASE_URL` is the Internal Database URL
- ✅ Check logs for specific error messages
- ✅ Ensure `package.json` has correct `start` script

### Database Connection Issues
- ✅ Verify `DATABASE_URL` format is correct
- ✅ Check PostgreSQL database is running (should show "Available")
- ✅ Ensure you're using Internal Database URL (not External)
- ✅ Check if SSL is required (Render handles this automatically)

### Frontend Can't Connect to Backend
- ✅ Verify `REACT_APP_API_URL` points to correct backend URL
- ✅ Check CORS configuration in backend
- ✅ Verify backend is running and healthy
- ✅ Check browser console for CORS errors

### High Log Volume
- ✅ Ensure `DB_LOGGING=false` is set (or not set, defaults to false)
- ✅ Check Render service logs for verbose output

### Slow First Request (Free Tier)
- ✅ Free tier services "spin down" after 15 min inactivity
- ✅ First request after spin-down takes ~30 seconds
- ✅ This is normal for free tier
- ✅ Consider upgrading to paid tier if needed

---

## Cost Summary

**Free Tier (Sufficient for <100 visits/day):**
- PostgreSQL Database: **$0/month** (512 MB storage)
- Backend Web Service: **$0/month** (512 MB RAM, spins down when idle)
- Frontend Web Service: **$0/month** (512 MB RAM, spins down when idle)
- **Total: $0/month**

**Limitations:**
- Services spin down after 15 min inactivity
- 512 MB storage for database
- 512 MB RAM per service
- Slower cold starts (~30 seconds)

**When to Upgrade:**
- >100 visits/day
- Need always-on services
- Need more storage/RAM
- Production requirements

---

## Environment Variables Reference

### Backend Environment Variables
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-secret-key-here
DB_LOGGING=false
GROK_API_KEY=your-api-key (optional)
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-backend.onrender.com
NODE_ENV=production
```

---

## Next Steps

1. ✅ Monitor logs for first few days
2. ✅ Set up alerts (if needed)
3. ✅ Configure backups (if using paid tier)
4. ✅ Update documentation with your URLs
5. ✅ Test all features thoroughly

---

## Support

- **Render Documentation**: https://render.com/docs
- **Render Status**: https://status.render.com
- **PostgreSQL on Render**: https://render.com/docs/databases

---

**Congratulations!** 🎉 Your application is now deployed on Render with PostgreSQL!

