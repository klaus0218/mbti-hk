# Fix Frontend 404 Error on Render

## Problem
The frontend is deployed but JavaScript files are returning 404 errors:
- `GET /static/js/main.d5984d9b.js net::ERR_ABORTED 404`
- MIME type error: `'text/plain'` instead of `application/javascript`

## Root Cause
The build command on Render is missing `--legacy-peer-deps` flag, which can cause:
1. Build failures or incomplete builds
2. Different build output than expected
3. Missing files in the build directory

## Solution Applied

I've added two files to fix this:

### 1. `.npmrc` file (frontend/.npmrc)
```
legacy-peer-deps=true
```
This ensures npm always uses `--legacy-peer-deps` automatically.

### 2. `_redirects` file (frontend/public/_redirects)
```
/*    /index.html   200
```
This ensures React Router routes work correctly on Render static sites.

## Next Steps

### Option 1: Push Changes and Auto-Deploy (Recommended)

1. **Commit the new files:**
   ```bash
   git add frontend/.npmrc frontend/public/_redirects
   git commit -m "Fix Render static site configuration"
   git push origin main
   ```

2. **Render will automatically redeploy** (auto-deploy is enabled)

3. **Wait 5-10 minutes** for the build to complete

4. **Clear your browser cache** and test again

### Option 2: Update Build Command Manually

If you want to fix it immediately without pushing:

1. Go to [Render Dashboard](https://dashboard.render.com/static/srv-d445a51r0fns73fp64q0)
2. Click on **"hkmbti-frontend"** service
3. Go to **"Settings"** tab
4. Scroll to **"Build Command"**
5. Change from:
   ```
   npm install && npm run build
   ```
   To:
   ```
   npm install --legacy-peer-deps && npm run build
   ```
6. Click **"Save Changes"**
7. Go to **"Manual Deploy"** → **"Deploy latest commit"**
8. Wait for build to complete (~5-10 minutes)

## Verify the Fix

After redeployment:

1. **Check the new deployment:**
   - Go to Render Dashboard → hkmbti-frontend → "Events" tab
   - Look for a successful deployment

2. **Test in browser:**
   - Visit: https://hkmbti-frontend.onrender.com
   - Open browser console (F12)
   - Check for any errors
   - Verify the page loads correctly

3. **Check file paths:**
   - The JavaScript files should load from `/static/js/main.xxxxx.js`
   - No 404 errors should appear

## Why This Happens

React Create App builds generate hashed filenames (e.g., `main.d5984d9b.js`). If the build:
- Fails partially
- Uses different dependencies
- Has cache issues

It can produce different hash values, causing the HTML to reference files that don't exist.

The `.npmrc` file ensures consistent dependency resolution, preventing build differences.

## Additional Notes

- The `_redirects` file will be automatically copied to the build folder during build
- This ensures React Router client-side routing works on Render static sites
- Clear browser cache if you still see old errors (Ctrl+Shift+R or Cmd+Shift+R)

