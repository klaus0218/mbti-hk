# Render.com Deployment - Step by Step Guide

This guide provides a complete step-by-step flow to deploy your MBTI application to Render.com. You have two deployment options:

1. **Standard Node.js Deployment** (Recommended for beginners)
2. **Docker-based Deployment** (If you prefer containerized deployments)

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- ✅ GitHub account
- ✅ Code pushed to a GitHub repository
- ✅ Render.com account (sign up at https://render.com)
- ✅ All environment variables ready (see below)

---

## 🔧 Option 1: Standard Node.js Deployment (Recommended)

### **Step 1: Prepare Your Repository**

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Verify your Dockerfiles are correct** (we'll fix them in this guide)

---

### **Step 2: Create PostgreSQL Database on Render**

1. **Log in to Render Dashboard**
   - Go to https://dashboard.render.com
   - Sign in or create a free account

2. **Create PostgreSQL Database**
   - Click the **"New +"** button (top right corner)
   - Select **"PostgreSQL"**

3. **Configure Database Settings**
   - **Name**: `hkmbti-postgres` (or your preferred name)
   - **Database**: `mbti_db` (or leave default)
   - **User**: Auto-generated (e.g., `mbti_user`)
   - **Region**: Choose closest to you (e.g., `Singapore`, `Oregon`, `Frankfurt`)
   - **PostgreSQL Version**: `15` (recommended) or latest
   - **Plan**: 
     - **Free**: 512 MB storage (good for testing)
     - **Starter**: $7/month for 1 GB (for production)
   - Click **"Create Database"**

4. **Wait for Database Provisioning** (~1-2 minutes)
   - Status will change from "Creating" to "Available"

5. **Save Database Connection String**
   - Once available, click on your database service
   - Go to **"Connections"** tab
   - Copy the **Internal Database URL** (format: `postgresql://user:pass@host/dbname`)
   - ⚠️ **Important**: Use Internal URL for Render services (faster, free)
   - Save this URL - you'll need it for Step 3

   **Example format:**
   ```
   postgresql://mbti_user:abc123xyz@dpg-xxxxx-a.singapore-postgres.render.com/mbti_db
   ```

---

### **Step 3: Deploy Backend API**

1. **Create Web Service**
   - In Render dashboard, click **"New +"**
   - Select **"Web Service"**

2. **Connect GitHub Repository**
   - If first time: Click "Connect account" and authorize Render
   - Select your repository: `hkmbti` (or your repo name)
   - Click **"Connect"**

3. **Configure Backend Service**

   **Basic Settings:**
   - **Name**: `hkmbti-backend`
   - **Region**: Choose same region as your PostgreSQL database (for lower latency)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: 
     - **Free**: 512 MB RAM (spins down after 15 min inactivity)
     - **Starter**: $7/month (always-on, better performance)

4. **Set Environment Variables**
   Click **"Add Environment Variable"** for each:

   **Required Variables:**
   ```
   NODE_ENV = production
   PORT = 5000
   DATABASE_URL = <paste-your-internal-database-url-from-step-2>
   JWT_SECRET = <generate-random-secret-key>
   ```

   **Generate JWT_SECRET** (run in terminal):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as `JWT_SECRET`

   **Optional Variables:**
   ```
   DB_LOGGING = false
   GROK_API_KEY = <your-api-key-if-using-ai-features>
   FRONTEND_URL = https://hkmbti-frontend.onrender.com
   ```

5. **Create and Deploy**
   - Click **"Create Web Service"**
   - Render will automatically:
     - Clone your repository
     - Install dependencies
     - Start your backend
   - Wait for deployment (~5-10 minutes first time)
   - Watch the build logs in real-time

6. **Note Your Backend URL**
   - Once deployed, your backend will be available at:
   - `https://hkmbti-backend.onrender.com`
   - Save this URL for Step 4

7. **Verify Backend is Running**
   - Visit: `https://hkmbti-backend.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"MBTI API is running"}`
   - ⚠️ First request may take ~30 seconds (service spinning up - normal for free tier)

---

### **Step 4: Deploy Frontend**

You have **two options** for frontend deployment:

#### **Option A: Static Site (Recommended - Faster & Simpler)**

1. **Create Static Site**
   - Click **"New +"** → **"Static Site"**
   - Select your GitHub repository

2. **Configure Static Site**
   - **Name**: `hkmbti-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free (sufficient for most cases)

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL = https://hkmbti-backend.onrender.com
   ```
   ⚠️ Replace `hkmbti-backend.onrender.com` with your actual backend URL from Step 3

4. **Create Static Site**
   - Click **"Create Static Site"**
   - Wait for build and deployment (~5-10 minutes)

5. **Note Your Frontend URL**
   - Your frontend will be available at:
   - `https://hkmbti-frontend.onrender.com` (or similar)

---

#### **Option B: Node Web Service (If you need server features)**

1. **Create Web Service**
   - Click **"New +"** → **"Web Service"**
   - Select your repository

2. **Configure Frontend Service**
   - **Name**: `hkmbti-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build && npm install -g serve`
   - **Start Command**: `serve -s build -l 3000`
   - **Plan**: Free

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL = https://hkmbti-backend.onrender.com
   NODE_ENV = production
   ```

4. **Create Service**
   - Click **"Create Web Service"**

---

### **Step 5: Update CORS in Backend**

1. **Update Backend Environment Variables**
   - Go to your backend service in Render dashboard
   - Navigate to **"Environment"** tab
   - Add or update:
   ```
   FRONTEND_URL = https://hkmbti-frontend.onrender.com
   ```
   ⚠️ Replace with your actual frontend URL

2. **Update Backend Code (if needed)**
   - Check `backend/server.js` - ensure CORS allows your frontend URL
   - If your CORS uses `process.env.FRONTEND_URL`, it should work automatically
   - Render will auto-redeploy when environment variables change

3. **Manual Redeploy (if needed)**
   - Go to backend service → **"Manual Deploy"** → **"Deploy latest commit"**

---

### **Step 6: Verify Complete Deployment**

1. **Test Backend Health**
   ```
   https://hkmbti-backend.onrender.com/api/health
   ```
   Expected: `{"status":"OK","message":"MBTI API is running"}`

2. **Test Frontend**
   - Visit your frontend URL
   - Should load homepage
   - Open browser console (F12) - check for errors
   - Verify API calls are working

3. **Test Database Connection**
   - Check backend logs in Render dashboard
   - Look for: `✅ Connected to PostgreSQL database`
   - Look for: `✅ Database synchronized`
   - Tables will be created automatically on first start

4. **Test Full Application Flow**
   - Create a test session
   - Answer some questions
   - Submit responses
   - Calculate results
   - Verify everything works end-to-end

---

## 🐳 Option 2: Docker-based Deployment

If you prefer using Docker, you'll need to update your Dockerfiles first:

### **Step 1: Update Dockerfiles for Production**

#### **Frontend Dockerfile** (needs update)
Your current `frontend/Dockerfile` uses dev mode. For production:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Or for Node.js service:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

#### **Backend Dockerfile** (mostly good, but add healthcheck file)
Your backend Dockerfile references `healthcheck.js` but it doesn't exist. Create it:

**Create `backend/healthcheck.js`:**
```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
```

---

### **Step 2: Deploy with Docker on Render**

1. **Create Web Service** (same as Option 1, Step 3)
2. **Configure for Docker**:
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Context**: `backend` (or root if Dockerfile is in root)
3. **Set Environment Variables** (same as Option 1)
4. **Create Service**

Repeat for frontend with `frontend/Dockerfile`.

---

## 🔍 Troubleshooting Common Issues

### **Backend Issues**

**Problem: Backend won't start**
- ✅ Check environment variables are set correctly
- ✅ Verify `DATABASE_URL` uses Internal Database URL
- ✅ Check logs for specific errors
- ✅ Ensure `package.json` has correct `start` script

**Problem: Database connection fails**
- ✅ Verify `DATABASE_URL` format: `postgresql://user:pass@host/dbname`
- ✅ Check PostgreSQL service is running (status: "Available")
- ✅ Ensure using Internal Database URL (not External)
- ✅ Check SSL requirements (Render handles automatically)

**Problem: Slow first request**
- ✅ Normal for free tier - services spin down after 15 min inactivity
- ✅ First request takes ~30 seconds to spin up
- ✅ Consider upgrading to paid tier for always-on

### **Frontend Issues**

**Problem: Frontend can't connect to backend**
- ✅ Verify `REACT_APP_API_URL` points to correct backend URL
- ✅ Check CORS configuration in backend
- ✅ Verify backend is running and healthy
- ✅ Check browser console for CORS errors
- ✅ Ensure backend has `FRONTEND_URL` environment variable set

**Problem: Build fails**
- ✅ Check build logs in Render dashboard
- ✅ Verify all dependencies are in `package.json`
- ✅ Check for TypeScript/ESLint errors
- ✅ Ensure Node version compatibility

### **Database Issues**

**Problem: Tables not created**
- ✅ Check backend logs for database connection messages
- ✅ Verify Sequelize is configured correctly
- ✅ Check database permissions
- ✅ Look for migration errors in logs

---

## 💰 Cost Summary

### **Free Tier** (Good for testing & low traffic)
- PostgreSQL Database: **$0/month** (512 MB storage)
- Backend Web Service: **$0/month** (512 MB RAM)
- Frontend Static Site: **$0/month** (unlimited requests)
- **Total: $0/month**

**Limitations:**
- Services spin down after 15 min inactivity
- 512 MB database storage
- Slower cold starts (~30 seconds)
- No custom domains on free tier

### **Starter Tier** (Recommended for production)
- PostgreSQL Database: **$7/month** (1 GB storage)
- Backend Web Service: **$7/month** (always-on, 512 MB RAM)
- Frontend Static Site: **$0/month** (still free!)
- **Total: ~$14/month**

**Benefits:**
- Always-on services (no spin-down)
- Better performance
- Custom domain support
- More storage

---

## 📝 Environment Variables Quick Reference

### **Backend** (`hkmbti-backend`)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host/dbname
JWT_SECRET=your-generated-secret-key
DB_LOGGING=false
FRONTEND_URL=https://hkmbti-frontend.onrender.com
GROK_API_KEY=optional-if-using-ai
```

### **Frontend** (`hkmbti-frontend`)
```env
REACT_APP_API_URL=https://hkmbti-backend.onrender.com
NODE_ENV=production
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check returns OK
- [ ] Frontend loads without errors
- [ ] Database connection successful
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Test full application flow
- [ ] Check logs for any warnings
- [ ] Monitor first few days
- [ ] Set up custom domain (optional)
- [ ] Configure backups (if using paid tier)

---

## 🎉 Congratulations!

Your application should now be live on Render.com! 

**Your URLs:**
- Frontend: `https://hkmbti-frontend.onrender.com`
- Backend: `https://hkmbti-backend.onrender.com`
- Database: Managed by Render (internal access only)

---

## 📚 Additional Resources

- **Render Documentation**: https://render.com/docs
- **PostgreSQL on Render**: https://render.com/docs/databases
- **Render Status Page**: https://status.render.com
- **Render Community**: https://community.render.com

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render service logs
3. Check browser console for frontend errors
4. Verify all environment variables
5. Ensure database is running
6. Contact Render support or check their docs

**Happy Deploying! 🚀**

