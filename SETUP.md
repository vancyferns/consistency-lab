# Consistency Lab - Setup Instructions

## ✅ Phase 1 Complete!

The foundation has been set up:

- ✅ Next.js 14 with TypeScript
- ✅ shadcn/ui components installed
- ✅ Flask backend structure created
- ✅ Supabase client configured
- ✅ Database schema ready
- ✅ API endpoints scaffolded
- ✅ AI services (Gemini 2.5 Flash) ready

## 📁 Project Structure

```
consistency_lab/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── layout.tsx       # Root layout
│   │   └── dashboard/
│   │       └── page.tsx     # Dashboard
│   ├── components/ui/       # shadcn/ui components
│   └── lib/
│       └── supabase.ts      # Supabase client
├── backend/
│   ├── app.py               # Flask app
│   ├── requirements.txt     # Python dependencies
│   ├── api/                 # API blueprints
│   │   ├── playlist.py      # Playlist analysis
│   │   ├── schedule.py      # Schedule generation
│   │   ├── ai_assistant.py  # Chatbot
│   │   └── ai_content.py    # Summaries & quizzes
│   ├── services/
│   │   ├── gemini_service.py
│   │   ├── youtube_service.py
│   │   ├── transcript_service.py
│   │   ├── ai_content_analyzer.py
│   │   ├── ai_quiz_generator.py
│   │   └── scheduler_service.py
│   └── utils/
└── database/
    └── schema.sql           # Supabase database schema
```

## 🚀 Next Steps

### 1. Set Up Environment Variables

**Backend:** Create `backend/.env`
```
YOUTUBE_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
SUPABASE_URL=your_url_here
SUPABASE_KEY=your_key_here
SECRET_KEY=random_secret_key
```

**Frontend:** Create `frontend/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Set Up Supabase Database

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run the SQL from `database/schema.sql`
4. Enable Google OAuth in Authentication settings

### 4. Run the Applications

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

Visit `http://localhost:3000`

## 🔑 API Keys Needed

1. **YouTube Data API v3**: https://console.cloud.google.com/
2. **Gemini 2.5 Flash**: https://aistudio.google.com/apikey
3. **Supabase**: https://supabase.com

## 📝 What's Built

### Backend API Endpoints
- `POST /api/playlist/analyze` - Analyze YouTube playlists
- `POST /api/schedule/generate` - Generate study schedules
- `POST /api/ai/chat` - AI chatbot
- `POST /api/ai/summarize` - Course summaries
- `POST /api/ai/generate-quiz` - Quiz generation

### Frontend Pages
- `/` - Landing page
- `/dashboard` - Main dashboard (basic version)

## 🎯 Next: Phase 2

Complete remaining features:
- YouTube API integration testing
- Transcript fetching
- AI content analysis
- Full dashboard implementation

Ready to continue! 🚀
