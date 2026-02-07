# Quick Start - Consistency Lab

## 🚀 5-Minute Setup

### Step 1: Get API Keys (5 minutes)

**YouTube Data API v3:**
1. Go to https://console.cloud.google.com/
2. Create project → Enable "YouTube Data API v3"
3. Create credentials → API Key
4. Copy the API key

**Gemini 2.5 Flash:**
1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the API key

### Step 2: Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
YOUTUBE_API_KEY=paste_your_youtube_key_here
GEMINI_API_KEY=paste_your_gemini_key_here
SECRET_KEY=any_random_text
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### Step 3: Configure Frontend

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 4: Run

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Test

1. Open http://localhost:3000/dashboard
2. Paste this playlist: `PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab`
3. Click "Analyze"
4. Click "Generate AI Summary"

✅ **You're done!**

## Features Working

✅ Playlist analysis with video count and duration
✅ AI-powered course summaries
✅ Topic extraction
✅ Difficulty level analysis
✅ Beautiful UI with shadcn/ui

## What's Next?

See `PHASE2_TESTING.md` for detailed testing instructions.

---

**Issues?**
- Backend not starting → Check Python version (3.8+)
- Frontend not starting → Run `npm install` again
- API errors → Verify API keys are correct
