# Consistency Lab 🎓⚔️

**The Becoming League Learning Engine - Level Up Your Learning!**

Transform any YouTube playlist or document into an intelligent, gamified learning experience with AI-powered features, personalized scheduling, RPG-style progression, and Minecraft-inspired UI. Track your consistency, earn XP, complete quests, and maintain streaks while mastering new skills.

---

## ✨ Features

### 🎯 Core Features
- **Dual Learning Sources**: 
  - YouTube Playlist Analyzer with video-by-video tracking
  - NotebookLM-style Document Analysis for text-based learning
- **Smart 3-Day Scheduler**: Flexible scheduling based on your weekly availability (customize any days)
- **Consistency Heatmap**: Visual grid showing watched vs. missed days (GitHub-style calendar)
- **Smart Progress Tracking**: Shows exactly which lecture is next based on your completion status
- **Session Persistence**: Saves your exact position and progress across sessions
- **Multi-Course Management**: Track multiple playlists and courses simultaneously

### 🎮 Gamification System (RPG-Style)
- **XP & Leveling System**: 
  - Earn 100 XP per video completed
  - Level up every 500 XP (consistent across all levels)
  - Visual progress bars with Minecraft-inspired pixel art
- **Streak Tracking**: 
  - Daily consistency streaks with 🔥 fire icons
  - Streak resets to 0 if you skip a day (no buffer)
  - Real-time streak updates after video completion
- **Quest System**: 
  - Daily and weekly quests with rewards
  - Quest modal with Minecraft-style inventory UI
  - Badges and achievements for milestones
- **Stats Dashboard**: 
  - Total videos watched
  - Current level and XP progress
  - Active streaks and badges
  - Minecraft-themed UI with sword icon (⚔️)

### 🤖 AI-Powered Features (Gemini 2.5 Flash)
- **AI Learning Assistant**: Conversational chatbot with context-aware responses using RAG
- **Course Summaries**: Auto-generated overviews, key topics, and difficulty levels
- **Smart Quiz Generator**: Automated quizzes from video transcripts with explanations and difficulty levels
- **Flashcard Creator**: AI-generated flashcards for key concepts with spaced repetition
- **Video Summaries**: Comprehensive TL;DR, key points, takeaways, prerequisites, and next steps
- **Learning Analytics**: Study pattern analysis, completion predictions, personalized recommendations
- **Learning Style Detection**: Auto-adapts content based on your learning preferences
- **NotebookLM-Style Analysis**: Document processing for PDFs and text-based content

### 🎨 Modern UI/UX
- **Dark/Light Theme Toggle**: Seamless theme switching with smooth transitions
- **Minecraft-Inspired Design**: Pixel art elements, retro gaming aesthetics
- **Animated Landing Page**: Gradient orbs, smooth animations with Framer Motion
- **Mobile-First Responsive**: Optimized layouts for all screen sizes
- **Glassmorphism Effects**: Backdrop blur and translucent cards
- **Interactive Components**: Hover effects, scale animations, smooth transitions

---

## 🛠️ Complete Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | React framework with app directory, SSR, and routing |
| **React** | 19.2.3 | UI library for component-based architecture |
| **TypeScript** | ^5 | Type-safe JavaScript for better developer experience |
| **Tailwind CSS** | ^4 | Utility-first CSS framework for rapid styling |
| **shadcn/ui** | ^3.8.4 | High-quality, accessible React component library |
| **Framer Motion** | ^12.33.0 | Animation library for smooth transitions and effects |
| **Lucide React** | ^0.563.0 | Icon library (1000+ customizable icons) |
| **Radix UI** | Multiple | Headless, accessible UI primitives (dropdown, avatar, dialog) |
| **next-themes** | ^0.4.6 | Dark/light mode with system preference detection |
| **date-fns** | ^4.1.0 | Date utility library for formatting and calculations |
| **canvas-confetti** | ^1.9.4 | Celebration animations for achievements |
| **clsx + tailwind-merge** | Latest | Conditional class merging utilities |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Flask** | >=3.0.0 | Lightweight Python web framework for REST API |
| **Flask-CORS** | >=4.0.0 | Cross-origin resource sharing for frontend communication |
| **Gunicorn** | >=21.2.0 | Production-grade WSGI HTTP server |
| **google-api-python-client** | >=2.110.0 | YouTube Data API v3 integration |
| **google-generativeai** | >=0.3.2 | Gemini AI API client |
| **youtube-transcript-api** | >=0.6.2 | Extract video transcripts for AI analysis |
| **isodate** | >=0.6.1 | ISO 8601 date/time parser for YouTube durations |
| **supabase** | >=2.3.0 | Python client for Supabase database |
| **pypdf** | >=4.0.0 | PDF text extraction for document analysis |
| **python-dotenv** | >=1.0.0 | Environment variable management |

### Database & Backend Services
| Technology | Purpose |
|-----------|---------|
| **Supabase (PostgreSQL)** | Primary database with real-time subscriptions |
| **pgvector Extension** | Vector embeddings for semantic search (RAG) |
| **Supabase Auth** | Google OAuth 2.0 authentication |
| **Row Level Security (RLS)** | User-specific data isolation |

### AI & APIs
| Service | Purpose |
|---------|---------|
| **Gemini 2.5 Flash** | AI content analysis, quiz generation, chatbot |
| **YouTube Data API v3** | Playlist metadata, video details, durations |
| **YouTube Transcript API** | Video captions for AI processing |

### DevOps & Tools
| Tool | Purpose |
|------|---------|
| **Git/GitHub** | Version control and collaboration |
| **ESLint** | Code linting for JavaScript/TypeScript |
| **PostCSS** | CSS transformation for Tailwind |
| **Python venv** | Virtual environment for backend dependencies |

---

## 📁 Project Structure

```
consistency_lab/
├── frontend/                       # Next.js 16 Application
│   ├── app/                        # App directory (Next.js 13+ routing)
│   │   ├── page.tsx                # Landing page with animated hero
│   │   ├── layout.tsx              # Root layout with theme provider
│   │   ├── globals.css             # Global styles and Tailwind config
│   │   ├── dashboard/              # Main dashboard pages
│   │   │   ├── page.tsx            # 3-step workflow (Analyze → Schedule → Track)
│   │   │   ├── course/[id]/        # Individual course page
│   │   │   └── progress/           # Progress tracking page
│   │   ├── learning-tools/         # AI-powered learning tools
│   │   └── progress/               # User progress analytics
│   ├── components/                 # React Components
│   │   ├── ui/                     # shadcn/ui primitives (button, card, dialog, etc.)
│   │   ├── Navbar.tsx              # Main navigation with Minecraft styling
│   │   ├── AuthButton.tsx          # Google OAuth login button
│   │   ├── ThemeToggle.tsx         # Dark/light mode switcher
│   │   ├── GamificationStats.tsx   # XP, level, streak display (Minecraft UI)
│   │   ├── PlaylistAnalyzer.tsx    # YouTube playlist input & analysis
│   │   ├── NotebookAnalyzer.tsx    # Document upload & NotebookLM-style analysis
│   │   ├── GoalPicker.tsx          # Study schedule configuration
│   │   ├── ConsistencyHeatmap.tsx  # Calendar grid for daily consistency
│   │   ├── VideoProgress.tsx       # Individual video tracking component
│   │   ├── QuestModal.tsx          # Daily/weekly quests with rewards
│   │   ├── QuizGenerator.tsx       # AI-powered quiz component
│   │   ├── FlashcardsGenerator.tsx # Flashcard creation tool
│   │   ├── VideoSummaryGenerator.tsx # AI video summary tool
│   │   ├── LearningAnalytics.tsx   # Study pattern insights
│   │   ├── StudyLogger.tsx         # Manual study session logging
│   │   └── AnimatedBackground.tsx  # Landing page animated orbs
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client configuration
│   │   └── utils.ts                # Utility functions (cn, formatters)
│   ├── package.json                # Frontend dependencies
│   ├── tsconfig.json               # TypeScript configuration
│   ├── next.config.ts              # Next.js configuration
│   └── components.json             # shadcn/ui configuration
│
├── backend/                        # Flask REST API
│   ├── app.py                      # Main Flask application entry point
│   ├── requirements.txt            # Python dependencies
│   ├── api/                        # API Route Handlers
│   │   ├── __init__.py             
│   │   ├── playlist.py             # Playlist analysis endpoints
│   │   ├── progress.py             # Progress tracking, stats, video completion
│   │   ├── schedule.py             # Goal setting and schedule generation
│   │   ├── notebook.py             # NotebookLM-style document processing
│   │   ├── ai_assistant.py         # Chatbot with RAG
│   │   ├── ai_content.py           # Video summaries, quizzes
│   │   └── learning_tools.py       # Flashcards, analytics
│   ├── services/                   # Business Logic Layer
│   │   ├── __init__.py
│   │   ├── youtube_service.py      # YouTube API integration
│   │   ├── transcript_service.py   # Transcript fetching & processing
│   │   ├── gemini_service.py       # Gemini AI client wrapper
│   │   ├── ai_content_analyzer.py  # Course analysis with AI
│   │   ├── ai_quiz_generator.py    # Quiz generation logic
│   │   ├── ai_learning_tools.py    # Flashcards, summaries
│   │   ├── scheduler_service.py    # Schedule calculation
│   │   └── notebook_service.py     # Document processing (PDF/text)
│   └── utils/
│       └── __init__.py
│
├── database/                       # Database Schema & Migrations
│   ├── schema.sql                  # Complete PostgreSQL schema
│   └── update_consistency_logs.sql # Migration for consistency tracking
│
├── docs/                           # Documentation
│   ├── implementation_plan.md      # Detailed technical specifications
│   ├── ai_architecture.md          # AI/ML system design
│   └── gemini_quickstart.md        # Gemini API usage guide
│
├── README.md                       # This file
├── task.md                         # Development task checklist
├── SETUP.md                        # Detailed setup instructions
├── API_KEYS_SETUP.md               # API key configuration guide
├── GOOGLE_AUTH_SETUP.md            # OAuth setup guide
├── PROJECT_SUMMARY.md              # Project overview
└── POINT_SYSTEM.md                 # XP and leveling documentation
```

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js & npm**
   - Node.js 18+ recommended
   - npm or yarn package manager

2. **Python**
   - Python 3.9+ required
   - pip package manager
   - Virtual environment (recommended)

3. **Google Cloud Project**
   - Enable YouTube Data API v3
   - Create OAuth 2.0 credentials for web application
   - Add authorized redirect URIs for Supabase
   - Download credentials JSON

4. **Google AI Studio**
   - Get Gemini 2.5 Flash API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Free tier: 15 requests/minute, 1,500/day, 1 million tokens/month

5. **Supabase Project**
   - Create free account at [supabase.com](https://supabase.com)
   - Create new project
   - Get Project URL and anon/public API key
   - Get service role key (for backend)
   - Configure Google OAuth provider in Authentication settings

### Quick Installation

```bash
# Clone repository
git clone https://github.com/vancyferns/consistency-lab.git
cd consistency_lab

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Configuration

**Create `frontend/.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Create `backend/.env`:**
```env
# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key_from_google_cloud

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key

# Flask Configuration (optional)
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

### Database Setup

1. **Run Schema in Supabase SQL Editor:**
   ```sql
   -- Copy and execute database/schema.sql in Supabase dashboard
   -- This creates all tables: playlists, goals, video_progress, consistency_logs, etc.
   ```

2. **Enable Row Level Security (RLS):**
   ```sql
   -- RLS policies are included in schema.sql
   -- Ensures users can only access their own data
   ```

3. **Configure Authentication:**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add Google OAuth Client ID and Secret
   - Add authorized redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Run Development Servers

```bash
# Terminal 1: Start Backend API
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
# Backend runs on http://localhost:5000

# Terminal 2: Start Frontend
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### First Time Setup

1. Visit `http://localhost:3000`
2. Click "Login with Google" in navigation
3. Complete OAuth flow
4. You'll be redirected to dashboard
5. Paste a YouTube playlist URL to start!

---

## 📚 Documentation

- **[Setup Guide](SETUP.md)**: Step-by-step installation and configuration
- **[API Keys Setup](API_KEYS_SETUP.md)**: Detailed guide for obtaining all required API keys
- **[Google Auth Setup](GOOGLE_AUTH_SETUP.md)**: OAuth 2.0 configuration walkthrough
- **[Implementation Plan](docs/implementation_plan.md)**: Complete technical specifications
- **[AI Architecture](docs/ai_architecture.md)**: RAG system, ML models, prompt engineering
- **[Gemini Quickstart](docs/gemini_quickstart.md)**: Code examples and best practices
- **[Point System](POINT_SYSTEM.md)**: XP, leveling, and streak mechanics
- **[Task Breakdown](task.md)**: Development checklist and progress tracking

---

## 🎯 Key Features & Workflows

### 1. Analyze a YouTube Playlist
```
User pastes YouTube playlist URL
  ↓
Backend fetches videos via YouTube Data API v3
  ↓
Extracts: title, duration, video count, thumbnails
  ↓
(Optional) Gemini AI analyzes content and generates course summary
  ↓
Saves playlist data to Supabase database
  ↓
Frontend displays video list with total duration
```

### 2. Set Learning Goals & Schedule
```
User selects study days (e.g., Mon/Wed/Fri) and hours per day
  ↓
Backend calculates videos per session based on duration
  ↓
Generates personalized study schedule with target completion date
  ↓
Creates consistency tracking calendar (heatmap ready)
  ↓
User can adjust schedule or start immediately
```

### 3. Track Progress & Earn XP
```
User marks video as complete
  ↓
Backend updates video_progress table (completed=true)
  ↓
Logs activity in consistency_logs (date, video_id, duration)
  ↓
Awards 100 XP (500 XP per level, consistent progression)
  ↓
Checks streak: +1 if consecutive day, reset to 0 if skipped
  ↓
Frontend updates: XP bar, level, streak fire icons, stats
```

### 4. AI Learning Assistant (RAG-Powered)
```
User asks question about course content
  ↓
Backend retrieves video transcript from YouTube
  ↓
Chunks transcript into semantic segments
  ↓
RAG system searches pgvector database for relevant context
  ↓
Gemini 2.5 Flash generates contextual response with retrieved chunks
  ↓
Streams answer to frontend in real-time
```

### 5. NotebookLM-Style Document Analysis
```
User uploads PDF or text document
  ↓
Backend extracts text using pypdf library
  ↓
Gemini AI analyzes content structure
  ↓
Generates: summary, key concepts, Q&A suggestions
  ↓
Creates interactive learning interface similar to NotebookLM
```

---

## 🧠 AI Engineering Highlights

### Prompt Engineering
- **Course Analysis**: Structured prompts for curriculum generation
- **Quiz Generation**: Multi-difficulty questions with explanations
- **Video Summaries**: TL;DR, key points, prerequisites, next steps format
- **Chatbot**: System prompts with context injection for accurate responses

### RAG (Retrieval-Augmented Generation)
- **Vector Embeddings**: Supabase pgvector extension for semantic search
- **Chunking Strategy**: 500-token chunks with 50-token overlap
- **Similarity Search**: Cosine similarity for top-k retrieval
- **Context Window Management**: Fits within Gemini 2.5 Flash's 1M token limit

### Intelligent Caching
- **Multi-Layer Caching**:
  1. Database cache (ai_course_insights, ai_quiz_questions)
  2. Session cache for repeated queries
  3. Transcript cache to avoid re-fetching
- **Cost Optimization**: Reduces API calls by ~80%

### Rate Limiting & Error Handling
- **Gemini Free Tier**: 15 requests/minute, 1,500/day
- **Exponential Backoff**: Automatic retry with increasing delays
- **Graceful Degradation**: Falls back to cached data when API limits hit

### Adaptive Learning (Future Enhancement)
- **Completion Prediction**: ML model predicts success probability
- **Schedule Optimization**: Adjusts based on user behavior patterns
- **Learning Style Detection**: Adapts content presentation (visual/auditory/reading)

---

## 📊 Database Schema Overview

### Core Tables
- **`playlists`**: Stores analyzed YouTube playlists (id, user_id, youtube_playlist_id, title, video_count, duration)
- **`goals`**: User study schedules (playlist_id, study_days, hours_per_day, start_date, target_completion_date)
- **`video_progress`**: Individual video tracking (user_id, youtube_video_id, current_position, completed, last_watched)
- **`consistency_logs`**: Daily activity logs (user_id, activity_type, video_id, date, duration_minutes)

### AI Tables (Caching)
- **`video_transcripts`**: Cached YouTube transcripts with timestamps
- **`ai_course_insights`**: Generated course summaries, syllabi, difficulty ratings
- **`ai_quiz_questions`**: Pre-generated quiz banks with answers and explanations
- **`ai_chat_history`**: User conversation history for context continuity
- **`ai_learning_insights`**: User-specific learning patterns and predictions

### Authentication
- **`auth.users`**: Managed by Supabase Auth (Google OAuth)
- **Row Level Security (RLS)**: All tables filtered by user_id automatically

See [database/schema.sql](database/schema.sql) for complete DDL.

---

## 🎨 Design System

### Color Palette
- **Primary**: Indigo/Purple gradients (gamification, active states)
- **Secondary**: Amber/Brown (Minecraft-inspired, badges)
- **Success**: Green (completed videos, streaks)
- **Neutral**: Slate (dark theme), White (light theme)

### Typography
- **Headings**: Monospace font for retro gaming feel
- **Body**: Inter/System font for readability
- **Icons**: Lucide React + Emojis for visual hierarchy

### Component Design Patterns
- **Glassmorphism**: Backdrop blur with semi-transparent backgrounds
- **Pixel Art Borders**: 2-3px borders with inset shadows (Minecraft style)
- **Card-Based Layout**: Elevated cards with hover effects
- **Responsive Grid**: Mobile-first with breakpoints (sm: 640px, md: 768px, lg: 1024px)

### Animation Principles
- **Framer Motion**: Spring animations for natural feel
- **Micro-interactions**: Button scales, hover lifts, smooth color transitions
- **Loading States**: Skeleton screens and progress indicators
- **Celebration Effects**: Confetti for level-ups, badge unlocks

---

## 🚢 Deployment

### Frontend (Vercel Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy to Vercel
vercel --prod

# Or connect GitHub repo in Vercel dashboard for automatic deployments
```

**Environment Variables in Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (your backend URL)

### Backend (Render/Railway/Fly.io)

**Using Render:**
1. Create new Web Service
2. Connect GitHub repository
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn app:app`
5. Add environment variables in dashboard

**Procfile (for Heroku/Render):**
```
web: gunicorn app:app
```

### Database (Supabase)
- Already hosted, no deployment needed
- Ensure production environment variables point to production Supabase project
- Enable RLS policies for security

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Google OAuth login flow
- [ ] YouTube playlist URL parsing and analysis
- [ ] Goal setting with different study schedules
- [ ] Video completion and XP earning
- [ ] Streak calculation (test consecutive days and skips)
- [ ] Level-up animation at 500 XP thresholds
- [ ] Dark/light theme toggle
- [ ] Mobile responsiveness (all screen sizes)
- [ ] NotebookLM document upload

### API Endpoint Testing
```bash
# Test playlist analysis
curl -X POST http://localhost:5000/api/playlist/analyze \
  -H "Content-Type: application/json" \
  -d '{"playlist_url":"https://www.youtube.com/playlist?list=..."}'

# Test user stats
curl http://localhost:5000/api/progress/stats?user_id=<uuid>

# Test video completion
curl -X POST http://localhost:5000/api/progress/video/complete \
  -H "Content-Type: application/json" \
  -d '{"user_id":"<uuid>","video_id":"dQw4w9WgXcQ","playlist_id":"<uuid>"}'
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "YouTube API quota exceeded"**
- YouTube Data API has daily quota limit (10,000 units for free tier)
- Playlist analysis uses ~5-10 units per video
- Solution: Wait for quota reset (midnight Pacific Time) or request quota increase

**2. "Gemini API rate limit"**
- Free tier: 15 requests/minute
- Solution: Backend implements exponential backoff and caching

**3. "Supabase RLS blocking queries"**
- Ensure user_id is passed correctly in API calls
- Check RLS policies in Supabase dashboard
- Use service role key in backend (never expose to frontend)

**4. "Google OAuth redirect_uri_mismatch"**
- Add exact callback URL in Google Cloud Console
- Format: `https://yourproject.supabase.co/auth/v1/callback`
- No trailing slashes or extra parameters

**5. "Video transcripts not found"**
- Not all YouTube videos have captions
- Solution: Fallback to video metadata analysis

**6. "Mobile layout overlapping"**
- Ensure latest fixes are pulled from main branch
- Check responsive classes (sm:, md:, lg:) in Tailwind

**7. "Stats not updating"**
- Run `database/update_consistency_logs.sql` migration
- Check field names in `video_progress` table (youtube_video_id vs video_id)

### Debug Mode

**Backend:**
```bash
# Enable Flask debug mode
export FLASK_DEBUG=True
python app.py
```

**Frontend:**
```bash
# View detailed Next.js logs
npm run dev -- --verbose
```

---

## 🤝 Contributing

Consistency Lab is part of **The Becoming League** initiative to make learning more structured and accountable.

### How to Contribute
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices for frontend
- Use Python type hints in backend code
- Write descriptive commit messages
- Test responsiveness on mobile before PR
- Update documentation for new features

### Feature Requests
Open an issue with:
- Clear description of the feature
- Use case and benefits
- Mockups or examples (if applicable)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components
- **[Supabase](https://supabase.com/)** - Open source Firebase alternative
- **[Google Gemini](https://ai.google.dev/)** - Advanced AI capabilities
- **[YouTube Data API](https://developers.google.com/youtube/v3)** - Playlist and video metadata
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[Lucide Icons](https://lucide.dev/)** - Beautiful open source icons
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Inspiration
- **Duolingo**: Gamification and streak mechanics
- **Minecraft**: Pixel art UI and retro gaming aesthetics
- **GitHub**: Contribution calendar/heatmap design
- **NotebookLM**: Document analysis and learning interface

---

## 📞 Contact & Support

- **GitHub Issues**: Report bugs and request features
- **Repository**: [vancyferns/consistency-lab](https://github.com/vancyferns/consistency-lab)
- **Project Lead**: [@vancyferns](https://github.com/vancyferns)

---

## 🎯 Roadmap

### Phase 1: Core Features ✅ (COMPLETE)
- [x] YouTube playlist analysis
- [x] Study schedule generator
- [x] Video progress tracking
- [x] Consistency logs and heatmap
- [x] Google OAuth authentication

### Phase 2: Gamification ✅ (COMPLETE)
- [x] XP and leveling system (100 XP/video, 500 XP/level)
- [x] Streak tracking with reset logic
- [x] Quest system with rewards
- [x] Minecraft-inspired UI design
- [x] Stats dashboard with badges

### Phase 3: AI Features 🚧 (IN PROGRESS)
- [x] NotebookLM-style document analysis
- [ ] AI Learning Assistant with RAG
- [ ] Quiz generator from transcripts
- [ ] Flashcard generation
- [ ] Video summaries
- [ ] Learning analytics

### Phase 4: Mobile & UX ✅ (COMPLETE)
- [x] Mobile-responsive design
- [x] Dark/light theme toggle
- [x] Animated landing page
- [x] Improved navigation spacing
- [x] Card-style tab selection

### Phase 5: Advanced Features 📅 (PLANNED)
- [ ] Spaced repetition algorithm
- [ ] Multi-language support
- [ ] Social features (study groups)
- [ ] Browser extension for quick saves
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync
- [ ] Export progress reports (PDF)

---

**Built with ❤️ for learners who value consistency**

*Level up your learning journey, one video at a time! ⚔️🎓*
