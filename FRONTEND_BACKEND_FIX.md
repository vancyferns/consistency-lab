# 🔧 Frontend & Backend Communication Fix

## Problem Identified
The frontend and backend are not communicating properly because:
1. Environment variables may not be loaded correctly
2. The Next.js dev server needs to be restarted to pick up `.env.local` changes

## Solution

### Step 1: Verify Environment Variables

Your `frontend/.env.local` file should contain:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://guittljwnglngasgxwhr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1aXR0bGp3bmdsbmdhc2d4d2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTI4MjgsImV4cCI6MjA4NjAyODgyOH0.ZUqpvcER0ol79YKLO5OUtj2Fr1iH9SLKkObwvvbzmG4
NEXT_PUBLIC_API_URL=http://localhost:5000
```

✅ **This is already correct!**

### Step 2: Restart Frontend Server

**IMPORTANT:** Next.js only loads environment variables when the dev server starts. If you added or changed `.env.local` while the server was running, you MUST restart it.

```bash
# In terminal where frontend is running:
# Press Ctrl+C to stop
# Then run again:
cd frontend
npm run dev
```

### Step 3: Clear Browser Cache

Sometimes the browser caches API responses or JavaScript files.

**Solution:**
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR

- Press Ctrl+Shift+Delete
- Clear cached files
- Reload the page

### Step 4: Check Browser Console

Open your browser and:
1. Go to http://localhost:3000/dashboard
2. Press F12 to open DevTools
3. Click "Console" tab
4. Look for errors (especially CORS or network errors)
5. Try clicking "Analyze" button
6. Check if API request appears in "Network" tab

### Expected Behavior

When you click "Analyze" with a playlist URL, you should see:
1. Button changes to "Analyzing..."
2. Network request to `http://localhost:5000/api/playlist/analyze`
3. Response with playlist data
4. Playlist information displays on screen

### Common Issues & Fixes

**Issue 1: CORS Error**
```
Access to fetch at 'http://localhost:5000/api/playlist/analyze' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Fix:** Backend already has CORS enabled via `Flask-CORS`. This should not happen.

**Issue 2: 404 Not Found**
```
POST http://localhost:5000/api/playlist/analyze 404 (Not Found)
```

**Fix:** Check that backend is running on port 5000. Our test confirmed it's working!

**Issue 3: Network Error**
```
Failed to fetch
```

**Fix:**
- Ensure backend is running (`python app.py` in backend folder)
- Check firewall isn't blocking localhost:5000
-  Try accessing http://localhost:5000 directly in browser

### Verification Steps

✅ **Backend is Running:**
```bash
cd backend
python app.py
# Should say: Running on http://127.0.0.1:5000
```

✅ **Frontend is Running:**
```bash
cd frontend
npm run dev
# Should say: ready - started server on 0.0.0.0:3000
```

✅ **API Works:**
We confirmed with `test_api.py` that the API returns:
- Playlist: "3Blue1Brown"
- 16 videos
- 181 minutes duration

✅ **Frontend .env is Correct:**
`NEXT_PUBLIC_API_URL=http://localhost:5000` ✓

### Quick Fix Script

Run this to restart everything clean:

```bash
# Stop all servers (Ctrl+C in both terminals)

# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend (NEW terminal)
cd frontend
npm run dev
```

### Test the Fix

1. Open: http://localhost:3000/dashboard
2. Paste this URL: `https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab`
3. Click "Analyze"
4. Should show "31ue1Brown" playlist with 16 videos

### If Still Not Working

**Check Frontend Console:**
1. Open http://localhost:3000/dashboard
2. Press F12
3. Paste this in Console and press Enter:
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log('Backend health:', d))
  .catch(e => console.error('Backend error:', e))
```

This will show if the frontend can reach the backend.

---

## Summary

✅ **Backend:** Working perfectly (confirmed with test_api.py)  
✅ **Environment:** `.env.local` configured correctly  
⚠️ **Frontend:** Needs restart to load environment variables  

**Action Required:**
1. Stop frontend server (Ctrl+C)
2. Restart: `npm run dev`  
3. Clear browser cache
4. Test again!

The issue is almost certainly that the Next.js dev server needs to be restarted to pick up the environment variables from `.env.local`.
