# Quick Deployment Checklist - Render.com

## Pre-Deployment Checklist

- [ ] Code pushed to GitHub repository
- [ ] PostgreSQL migration completed
- [ ] Environment variables documented
- [ ] CORS configuration updated

---

## Quick Steps

### 1. PostgreSQL Database (5 minutes)
```
Render Dashboard → New + → PostgreSQL
- Name: hkmbti-postgres
- Database: mbti_db
- Region: Choose closest
- Plan: Free
→ Copy Internal Database URL
```

### 2. Backend API (10 minutes)
```
Render Dashboard → New + → Web Service
- Connect GitHub repo
- Name: hkmbti-backend
- Root Directory: backend
- Build: npm install
- Start: npm start
- Plan: Free

Environment Variables:
✅ DATABASE_URL=<paste-internal-db-url>
✅ NODE_ENV=production
✅ PORT=5000
✅ JWT_SECRET=<generate-random-key>
✅ DB_LOGGING=false
✅ FRONTEND_URL=https://hkmbti-frontend.onrender.com
```

### 3. Frontend (5 minutes)
```
Option A - Static Site (Recommended):
Render Dashboard → New + → Static Site
- Connect GitHub repo
- Root Directory: frontend
- Build: cd frontend && npm install && npm run build
- Publish: frontend/build

Option B - Web Service:
Render Dashboard → New + → Web Service
- Root Directory: frontend
- Build: npm install && npm run build && npm install -g serve
- Start: serve -s build -l 3000

Environment Variables:
✅ REACT_APP_API_URL=https://hkmbti-backend.onrender.com
```

### 4. Test
```
✅ Backend: https://your-backend.onrender.com/api/health
✅ Frontend: https://your-frontend.onrender.com
✅ Create test session
✅ Submit responses
✅ Calculate result
```

---

## Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## URLs After Deployment

- **Backend**: `https://hkmbti-backend.onrender.com`
- **Frontend**: `https://hkmbti-frontend.onrender.com` (or static site URL)
- **Health Check**: `https://hkmbti-backend.onrender.com/api/health`

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Database connection error | Verify DATABASE_URL uses Internal Database URL |
| CORS errors | Add FRONTEND_URL to backend env vars, verify CORS config |
| Build fails | Check logs, verify all dependencies in package.json |
| Slow first request | Normal for free tier (15 min spin-down) |
| Tables not created | Check backend logs for sync messages |

---

## Need Help?

See detailed guide: `RENDER_DEPLOYMENT.md`

