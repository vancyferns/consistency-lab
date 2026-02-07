# Consistency Lab 🎓

**The Becoming League Learning Engine**

Transform any YouTube playlist into an intelligent, structured learning experience with AI-powered features, personalized scheduling, and consistency tracking.

---

## ✨ Features

### 🎯 Core Features
- **Playlist-to-Course Transformer**: Convert YouTube playlists into structured courses with AI-generated syllabi
- **3-Day Logic Engine**: Custom scheduler based on your weekly availability (e.g., Mon/Wed/Fri)
- **Consistency Heatmap**: Visual grid showing watched vs. missed days (GitHub-style)
- **Smart Nudge**: Shows exactly which lecture is next based on your progress
- **Progress Persistence**: Saves your exact position across sessions

### 🤖 AI-Powered Features (Gemini 2.5 Flash)
- **AI Learning Assistant**: Conversational chatbot with context-aware responses using RAG
- **Course Summaries**: Auto-generated overviews, key topics, and difficulty levels
- **Smart Quiz Generator**: Automated quizzes from video transcripts with explanations and difficulty levels
- **Flashcard Creator**: AI-generated flashcards for key concepts with spaced repetition
- **Video Summaries**: Comprehensive TL;DR, key points, takeaways, prerequisites, and next steps
- **Chapter Markers**: AI-detected chapter breaks with timestamps and descriptions
- **Personalized Notes**: Learning style-adapted notes (visual/auditory/reading/kinesthetic)
- **Learning Analytics**: Study pattern analysis, completion predictions, personalized recommendations
- **Learning Style Detection**: Auto-adapts content based on your learning preferences
- **Spaced Repetition Scheduling**: 30-day review calendar optimized for retention
- **Adaptive Scheduling**: ML-based schedule optimization based on your behavior
- **Progress Predictions**: AI-powered completion probability and risk analysis

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Next.js 14 + shadcn/ui | Modern, accessible dashboard |
| Backend | Flask (Python) | API for YouTube data, scheduling logic, AI services |
| Database | Supabase (PostgreSQL) | User data, progress tracking, AI caching |
| Auth | Google OAuth | Secure login via Supabase |
| AI | Gemini 2.5 Flash | Content analysis, quiz generation, chatbot |
| YouTube API | YouTube Data API v3 | Playlist metadata and video details |

---

## 📁 Project Structure

```
consistency_lab/
├── docs/                        # Documentation
│   ├── implementation_plan.md   # Detailed technical plan
│   ├── ai_architecture.md       # AI/ML engineering details
│   └── gemini_quickstart.md     # Gemini API quick reference
├── frontend/                    # Next.js application
│   ├── app/                     # Next.js 13+ app directory
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui primitives
│   │   └── AI*.tsx              # AI-powered components
│   └── lib/                     # Utilities and Supabase client
├── backend/                     # Flask API
│   ├── api/                     # API routes
│   ├── services/                # Business logic & AI services
│   └── utils/                   # Helper functions
├── database/                    # Supabase schema
└── task.md                      # Development task breakdown
```

---

## 🚀 Getting Started

### Prerequisites

1. **Google Cloud Project**
   - Enable YouTube Data API v3
   - Create OAuth 2.0 credentials

2. **Google AI Studio**
   - Get Gemini 2.5 Flash API key
   - Free tier: 15 requests/minute, 1,500/day

3. **Supabase Project**
   - Create free Supabase account
   - Get project URL and anon key

### Installation

```bash
# Clone repository
git clone <repository-url>
cd consistency_lab

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

### Environment Variables

Create `.env` files:

**frontend/.env.local**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**backend/.env**
```
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
```

### Run Development Servers

```bash
# Terminal 1: Backend
cd backend
python app.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000`

---

## 📚 Documentation

- **[Implementation Plan](docs/implementation_plan.md)**: Complete technical specifications
- **[AI Architecture](docs/ai_architecture.md)**: RAG system, ML models, prompt engineering
- **[Gemini Quickstart](docs/gemini_quickstart.md)**: Code examples and best practices
- **[Task Breakdown](task.md)**: Development checklist

---

## 🎯 Key Workflows

### 1. Analyze a Playlist
```
User inputs YouTube playlist URL
→ Backend fetches videos via YouTube API
→ Gemini AI analyzes content and generates summary
→ Saves to Supabase
```

### 2. Set Learning Goals
```
User selects study days (e.g., Mon/Wed/Fri)
→ Backend calculates completion date
→ Generates personalized schedule
→ Creates consistency tracking calendar
```

### 3. AI Learning Assistant
```
User asks question about course content
→ RAG retrieves relevant transcript chunks
→ Gemini 2.5 Flash generates contextual response
→ Streams answer to frontend
```

---

## 🧠 AI Engineering Highlights

- **RAG System**: Vector embeddings with Supabase pgvector for semantic search
- **Prompt Engineering**: Optimized templates for summaries, quizzes, and chat
- **Adaptive Learning**: ML-based completion prediction and schedule optimization
- **Intelligent Caching**: Multi-layer caching to minimize API costs
- **Rate Limiting**: Built-in handling for Gemini API free tier limits

---

## 📊 Database Schema

**Core Tables**
- `users`, `playlists`, `goals`, `video_progress`, `consistency_logs`

**AI Tables** (for caching)
- `video_transcripts`, `ai_course_insights`, `ai_quiz_questions`, `ai_chat_history`, `ai_learning_insights`

See [schema.sql](database/schema.sql) for full details.

---

## 🤝 Contributing

This project is part of **The Becoming League** initiative to make learning more structured and accountable.

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

- **YouTube Data API** for playlist metadata
- **Gemini 2.5 Flash** for AI capabilities
- **Supabase** for backend infrastructure
- **shadcn/ui** for beautiful components

---

**Built with ❤️ for learners who value consistency**
