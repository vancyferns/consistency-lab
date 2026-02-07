# Phase 2 Testing Guide

## 🧪 Testing the Playlist Analyzer

### Prerequisites
1. Get your API keys:
   - **YouTube Data API v3**: https://console.cloud.google.com/apis/credentials
   - **Gemini 2.5 Flash**: https://aistudio.google.com/apikey
   - **Supabase**: https://supabase.com (optional for Phase 2)

### Setup Backend

1. **Create environment file:**
```bash
cd backend
cp .env.example .env
```

2. **Edit `backend/.env`:**
```
YOUTUBE_API_KEY=your_actual_youtube_key
GEMINI_API_KEY=your_actual_gemini_key
SUPABASE_URL=your_supabase_url_or_leave_empty
SUPABASE_KEY=your_supabase_key_or_leave_empty
SECRET_KEY=any_random_string_here
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run backend:**
```bash
python app.py
```

Backend should start on `http://localhost:5000`

### Setup Frontend

1. **Create environment file:**
```bash
cd frontend
cp .env.local.example .env.local
```

2. **Edit `frontend/.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=leave_empty_for_now
NEXT_PUBLIC_SUPABASE_ANON_KEY=leave_empty_for_now
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Run frontend:**
```bash
npm run dev
```

Frontend should start on `http://localhost:3000`

### Test the Application

1. **Open browser:** Navigate to `http://localhost:3000/dashboard`

2. **Test with a playlist:** Use one of these public playlists:
   - **Short playlist (3 videos):** `PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab` (Math videos)
   - **Medium playlist (10+ videos):** `PL4cUxeGkcC9iPBaGBnwYrL5V8XNmCOT16` (Web dev)
   - **Full URL:** `https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab`

3. **Steps to test:**
   - Paste playlist URL/ID
   - Click "Analyze"
   - Wait for results (video count, duration, video list)
   - Click "Generate AI Course Summary"
   - Review AI-generated summary, topics, difficulty level

### Expected Results

✅ **Playlist Analysis:**
- Shows total video count
- Shows total duration in hours/minutes
- Displays first 10 videos with thumbnails
- Calculates estimated weeks to complete

✅ **AI Summary:**
- 2-3 sentence course overview
- 5-7 key topics as badges
- Difficulty level (Beginner/Intermediate/Advanced)
- Learning objectives list

### API Endpoint Testing (Backend Only)

Test APIs directly using curl or Postman:

**1. Analyze Playlist:**
```bash
curl -X POST http://localhost:5000/api/playlist/analyze \
  -H "Content-Type: application/json" \
  -d '{"playlist_id": "PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab"}'
```

**2. Generate AI Summary:**
```bash
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"video_id": "WUvTyaaNkzM"}'
```

**3. Generate Schedule:**
```bash
curl -X POST http://localhost:5000/api/schedule/generate \
  -H "Content-Type: application/json" \
  -d '{
    "total_duration_minutes": 300,
    "study_days": [0, 2, 4],
    "hours_per_day": 2
  }'
```

### Troubleshooting

**Backend won't start:**
- Check Python version (3.8+)
- Verify all dependencies installed: `pip list`
- Check for syntax errors in `.env` file

**Frontend won't start:**
- Check Node version (18+)
- Run `npm install` again
- Delete `.next` folder and restart

**Playlist analysis fails:**
- Verify YouTube API key is correct
- Check API quota hasn't been exceeded (10,000 units/day)
- Try a different public playlist
- Check backend console for errors

**AI summary fails:**
- Verify Gemini API key is correct
- Check if video has transcripts (not all do)
- Gemini free tier: 15 req/min, 1500 req/day
- Try a different video from the playlist

**CORS errors:**
- Backend should be running on port 5000
- Frontend should be on port 3000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Success Criteria for Phase 2

- [x] Backend API responds to playlist analyze requests
- [x] YouTube API successfully fetches playlist data
- [x] Video durations calculated correctly
- [x] Frontend displays playlist information
- [x] AI summary generation works
- [x] Transcript fetching works
- [x] Difficulty analysis displays properly  
- [x] Error handling shows user-friendly messages
- [x] Loading states work correctly

### Demo Video Workflow

1. Start both servers (backend + frontend)
2. Open dashboard in browser
3. Paste YouTube playlist URL
4. Show playlist analysis results
5. Generate AI summary
6. Show AI-generated topics and difficulty
7. Demonstrate error handling (invalid URL)

### Next: Phase 3

Once Phase 2 is validated:
- Schedule generator component
- Goal picker with calendar
- Completion date calculator
- Study day selector

---

**Need Help?** Check:
- Backend logs: Terminal running `python app.py`
- Frontend logs: Browser DevTools Console
- Network tab: See API request/response details
