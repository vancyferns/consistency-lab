# 🔑 API Keys Setup Guide

This guide will help you obtain all the necessary API keys for Consistency Lab.

---

## 📋 Required API Keys Checklist

- [ ] YouTube Data API v3 Key
- [ ] Google Gemini AI API Key
- [ ] Supabase Project URL
- [ ] Supabase Service Role Key
- [ ] Supabase Anon/Public Key
- [ ] Flask Secret Key

---

## 1️⃣ YouTube Data API v3 Key

### Steps to Get:

1. **Visit Google Cloud Console**
   - Go to: https://console.cloud.google.com/

2. **Create or Select Project**
   - Click "Select a project" → "New Project"
   - Name it: "Consistency Lab"
   - Click "Create"

3. **Enable YouTube Data API v3**
   - In the sidebar, go to: **APIs & Services** → **Library**
   - Search for: "YouTube Data API v3"
   - Click on it and press **Enable**

4. **Create API Credentials**
   - Go to: **APIs & Services** → **Credentials**
   - Click: **Create Credentials** → **API Key**
   - Copy the generated API key
   - (Optional) Click "Restrict Key" to limit to YouTube Data API only

5. **Add to .env File**
   ```bash
   # In backend/.env
   YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Free Tier Limits:
- ✅ **10,000 quota units per day**
- ✅ Approximately 100 playlist analyses per day
- ✅ No credit card required

### Test Your Key:
```bash
curl "https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&key=YOUR_API_KEY"
```

---

## 2️⃣ Google Gemini AI API Key

### Steps to Get:

1. **Visit Google AI Studio**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click: **Create API Key**
   - Select your Google Cloud project (or create new)
   - Click: **Create API Key in existing project**

3. **Copy the Key**
   - Your API key will be displayed
   - Click the copy icon
   - **IMPORTANT:** Save it securely (you won't see it again)

4. **Add to .env File**
   ```bash
   # In backend/.env
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Free Tier Limits:
- ✅ **15 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **1 million tokens per day**
- ✅ No credit card required

### Test Your Key:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Say hello!"}]}]}'
```

---

## 3️⃣ Supabase Configuration

### Steps to Get:

1. **Create Supabase Account**
   - Go to: https://supabase.com/
   - Click: **Start your project**
   - Sign up with GitHub or email

2. **Create New Project**
   - Click: **New Project**
   - Fill in details:
     - **Name:** Consistency Lab
     - **Database Password:** (generate strong password)
     - **Region:** Choose closest to you
   - Click: **Create new project**
   - Wait 2-3 minutes for setup

3. **Get API Credentials**
   - Go to: **Settings** (gear icon) → **API**
   - You'll find:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon public** key
     - **service_role** key (click "Reveal" to see)

4. **Add to .env Files**
   
   **Backend (.env):**
   ```bash
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role key)
   ```
   
   **Frontend (.env.local):**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon public key)
   ```

### ⚠️ IMPORTANT Security Note:
- **Backend:** Use `service_role` key (full access)
- **Frontend:** Use `anon public` key (protected by RLS)
- **NEVER** use `service_role` key in frontend!

### Set Up Database Schema:

1. In Supabase, go to: **SQL Editor**
2. Click: **New Query**
3. Copy the contents of `database/schema.sql`
4. Paste and click: **Run**

### Free Tier Limits:
- ✅ **500 MB database**
- ✅ **2 GB bandwidth per month**
- ✅ **50,000 monthly active users**
- ✅ No credit card required

---

## 4️⃣ Flask Secret Key

### Steps to Generate:

**Option 1: Using Python**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Manual (not recommended)**
- Use a long random string (64+ characters)

### Add to .env File:
```bash
# In backend/.env
SECRET_KEY=your_generated_64_character_random_string_here
```

---

## 📝 Complete .env File Examples

### Backend (.env)
```bash
# YouTube API
YOUTUBE_API_KEY=AIzaSyABC123...

# Gemini AI
GEMINI_API_KEY=AIzaSyXYZ789...

# Supabase
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Flask
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
FLASK_ENV=development
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## ✅ Verification Checklist

After setting up all keys, verify each one:

### 1. Test YouTube API
```bash
cd backend
python -c "from services.youtube_service import get_playlist_videos; print('YouTube API: OK' if get_playlist_videos('PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab') else 'YouTube API: FAILED')"
```

### 2. Test Gemini API
```bash
cd backend
python -c "from services.gemini_service import get_gemini_response; print('Gemini API:', get_gemini_response('Say hello')[:50])"
```

### 3. Test Supabase Connection
```bash
cd backend
python -c "import os; from supabase import create_client; client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY')); print('Supabase: OK')"
```

### 4. Start Backend Server
```bash
cd backend
python app.py
```
✅ Should see: `Running on http://0.0.0.0:5000`

### 5. Start Frontend Server
```bash
cd frontend
npm run dev
```
✅ Should see: `Ready on http://localhost:3000`

---

## 🔒 Security Best Practices

### DO:
- ✅ Keep `.env` files in `.gitignore`
- ✅ Use environment variables for all secrets
- ✅ Rotate API keys periodically
- ✅ Use different keys for development/production
- ✅ Enable API key restrictions in Google Cloud Console

### DON'T:
- ❌ Commit `.env` files to Git
- ❌ Share API keys in screenshots/videos
- ❌ Use production keys in development
- ❌ Use `service_role` key in frontend
- ❌ Hardcode keys in source code

---

## 🚨 Troubleshooting

### Issue: YouTube API Error 403
**Solution:** 
- Verify API key is correct
- Check if YouTube Data API v3 is enabled
- Verify quota isn't exceeded (10,000 units/day)

### Issue: Gemini API Error 429
**Solution:**
- Rate limit exceeded (15 requests/minute)
- Wait 1 minute and try again
- Implement request throttling

### Issue: Supabase Connection Error
**Solution:**
- Check project URL is correct
- Verify you're using correct key (service_role for backend, anon for frontend)
- Ensure project is active (not paused)

### Issue: CORS Error in Frontend
**Solution:**
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running
- Check Flask-CORS is installed

---

## 💰 Cost Overview (All Free!)

| Service | Free Tier | Cost After Limit |
|---------|-----------|------------------|
| YouTube API | 10,000 units/day | Pay as you go |
| Gemini AI | 1,500 requests/day | Pay as you go |
| Supabase | 500 MB DB, 2 GB bandwidth | $25/month Pro |
| Total Monthly | **$0** | Only if limits exceeded |

### Expected Usage (Normal):
- **YouTube API:** ~10-50 requests/day → **FREE** ✅
- **Gemini AI:** ~100-500 requests/day → **FREE** ✅
- **Supabase:** <500 MB, <2 GB → **FREE** ✅

---

## 📞 Support Resources

- **YouTube API:** https://developers.google.com/youtube/v3
- **Gemini AI:** https://ai.google.dev/docs
- **Supabase:** https://supabase.com/docs
- **Flask:** https://flask.palletsprojects.com/

---

## 🎉 Next Steps

Once all API keys are configured:

1. ✅ Run database migrations (execute `schema.sql` in Supabase)
2. ✅ Start backend: `cd backend && python app.py`
3. ✅ Start frontend: `cd frontend && npm run dev`
4. ✅ Visit: http://localhost:3000
5. ✅ Test with a YouTube playlist!

---

**Need help?** Check the troubleshooting section or open an issue!

**Ready to learn?** Your Consistency Lab is now fully configured! 🚀
