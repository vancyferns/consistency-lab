# Consistency Lab - AI-Powered Implementation Plan

Transform YouTube playlists into intelligent, adaptive learning experiences with AI-driven content analysis, personalized scheduling, conversational assistance, automated quiz generation, and advanced learning analytics using Next.js, Flask, Supabase, Gemini API, and YouTube Data API v3.

## User Review Required

> [!IMPORTANT]
> **Google Cloud & YouTube API Setup Required**
> You'll need to create a Google Cloud project and enable the YouTube Data API v3. You'll receive OAuth 2.0 credentials (Client ID and Client Secret) that need to be added to the application's environment variables.

> [!IMPORTANT]
> **Supabase Project Required**
> You'll need to create a free Supabase project and provide the project URL and anon key. These will be used for database operations and authentication.

> [!WARNING]
> **API Rate Limits**
> The YouTube Data API has quota limits (10,000 units/day for free tier). Each playlist items request costs ~1 unit, and video details cost ~1 unit per 50 videos. The app will implement caching to minimize API calls.

> [!IMPORTANT]
> **Gemini API for AI Features**
> You'll need a Google AI Studio API key for **Gemini 2.5 Flash**. The free tier provides 15 requests/minute and 1,500 requests/day, which is sufficient for all use cases. Gemini 2.5 Flash handles all AI features: content analysis, quiz generation, conversational assistance, and learning analytics with its 1M token context window.

> [!TIP]
> **AI Cost Optimization**
> The app implements intelligent caching for AI-generated content (summaries, quizzes, insights) to minimize API calls. Transcripts and AI responses are stored in Supabase to avoid redundant processing.

## Proposed Changes

### Project Structure

```
consistency_lab/
├── frontend/                 # Next.js application
│   ├── app/                 # Next.js 13+ app directory
│   ├── components/          # React components (shadcn/ui)
│   │   ├── ui/             # shadcn/ui primitives
│   │   └── AI*.tsx         # AI-powered components
│   ├── lib/                 # Utilities and Supabase client
│   └── public/              # Static assets
├── backend/                 # Flask API
│   ├── api/                 # API routes
│   │   ├── playlist.py
│   │   ├── schedule.py
│   │   ├── ai_assistant.py # AI endpoints
│   │   └── ai_content.py   # AI endpoints
│   ├── services/            # Business logic
│   │   ├── youtube_service.py
│   │   ├── gemini_service.py      # AI
│   │   ├── ai_*.py               # AI services
│   │   └── adaptive_scheduler.py # ML
│   ├── utils/               # Helper functions
│   └── models/              # ML model artifacts
├── database/                # Supabase schema & migrations
└── docs/                    # Documentation
    └── ai_architecture.md   # AI engineering details
```

---

### Frontend - Next.js Application

#### [NEW] [package.json](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/package.json)
- Next.js 14+ with App Router
- shadcn/ui components (Button, Card, Calendar, Select, Progress)
- Tailwind CSS for styling
- Supabase client for auth and database
- React Query for data fetching

#### [NEW] [app/layout.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/app/layout.tsx)
- Root layout with Supabase provider
- Global styles and fonts
- Metadata configuration

#### [NEW] [app/page.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/app/page.tsx)
- Landing page with Google OAuth login button
- App introduction and feature highlights

#### [NEW] [app/dashboard/page.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/app/dashboard/page.tsx)
- Main dashboard showing active courses
- Playlist input form
- Next lecture "Smart Nudge"
- Progress overview

#### [NEW] [components/ui/](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/components/ui)
- shadcn/ui components: Button, Card, Calendar, Select, Progress, Input
- Installed via `npx shadcn-ui@latest add`

#### [NEW] [components/PlaylistAnalyzer.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/components/PlaylistAnalyzer.tsx)
- Input form for YouTube playlist URL
- Calls backend `/analyze-playlist` endpoint
- Displays total duration and video count

#### [NEW] [components/GoalPicker.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/components/GoalPicker.tsx)
- Calendar component for selecting study days
- Weekly pattern selector (e.g., Mon/Wed/Fri)
- Hours per day input
- Calculates and displays completion date

#### [NEW] [components/ConsistencyHeatmap.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/components/ConsistencyHeatmap.tsx)
- Visual grid showing watched vs. missed days
- Color-coded: green for completed, red for missed, gray for scheduled
- GitHub-style contribution graph

#### [NEW] [components/ProgressTracker.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/components/ProgressTracker.tsx)
- Progress bar showing course completion percentage
- Video checklist with timestamps
- "Mark as Complete" buttons

#### [NEW] [lib/supabase.ts](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/lib/supabase.ts)
- Supabase client initialization
- Auth helpers for Google OAuth
- Database query utilities

#### [NEW] [components/AILearningAssistant.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/components/AILearningAssistant.tsx)
- **AI Feature**: Conversational chatbot interface using Gemini API
- Context-aware responses based on current video/course
- Floating chat widget with message history
- Answers questions about course content, concepts, and progress

#### [NEW] [components/AICourseSummary.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/components/AICourseSummary.tsx)
- **AI Feature**: Displays AI-generated course overview
- Key topics, learning objectives, prerequisites
- Difficulty level estimation
- Recommended study approach

#### [NEW] [components/AIQuizGenerator.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/components/AIQuizGenerator.tsx)
- **AI Feature**: Auto-generated quizzes from video transcripts
- Multiple choice and short answer questions
- Adaptive difficulty based on progress
- Instant feedback and explanations

#### [NEW] [components/AILearningInsights.tsx](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/components/AILearningInsights.tsx)
- **AI Feature**: Personalized learning analytics
- Study pattern analysis (best times, engagement levels)
- Completion probability predictions
- Recommendations for improvement
- Struggling topics identification

---

### Backend - Flask API

#### [NEW] [requirements.txt](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/requirements.txt)
- Flask & Flask-CORS
- google-api-python-client (YouTube API)
- google-generativeai (Gemini API)
- youtube-transcript-api
- supabase-py
- python-dotenv
- numpy, scipy (for analytics)
- scikit-learn (for ML predictions)

#### [NEW] [app.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/app.py)
- Flask app initialization
- CORS configuration
- Route registration

#### [NEW] [api/playlist.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/api/playlist.py)
- `POST /analyze-playlist`: Accepts playlist ID/URL
- Returns total duration, video count, and video list with durations

#### [NEW] [api/schedule.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/api/schedule.py)
- `POST /generate-schedule`: Accepts total minutes, weekly pattern, hours/day
- Calculates completion date
- Generates day-by-day study calendar
- Returns schedule with specific dates and video assignments

#### [NEW] [services/youtube_service.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/services/youtube_service.py)
- YouTube API client initialization
- `fetch_playlist_items()`: Gets all videos in a playlist
- `get_video_durations()`: Fetches duration for each video
- `parse_duration()`: Converts ISO 8601 duration to seconds
- Implements pagination for large playlists

#### [NEW] [services/scheduler_service.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/services/scheduler_service.py)
- `calculate_completion_date()`: Core scheduling algorithm
- Maps study days to calendar dates
- Distributes videos across selected days
- Handles irregular patterns (holidays, skipped weeks)

#### [NEW] [utils/date_helper.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/utils/date_helper.py)
- Date manipulation utilities
- ISO date formatting
- Weekday mapping (Mon=0, Sun=6)

#### [NEW] [api/ai_assistant.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/api/ai_assistant.py)
- **AI Feature**: `POST /ai/chat` - Conversational assistant endpoint
- Context management for multi-turn conversations
- RAG (Retrieval Augmented Generation) using video transcripts
- Streaming responses for better UX

#### [NEW] [api/ai_content.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/api/ai_content.py)
- **AI Feature**: `POST /ai/summarize` - Generate course summaries
- **AI Feature**: `POST /ai/extract-topics` - Extract key topics
- **AI Feature**: `POST /ai/analyze-difficulty` - Estimate content difficulty
- **AI Feature**: `POST /ai/generate-quiz` - Create quizzes from transcripts

#### [NEW] [services/gemini_service.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/services/gemini_service.py)
- Gemini 2.5 Flash API client initialization
- Prompt engineering templates for different AI tasks
- Response parsing and validation
- Token counting and cost tracking
- Error handling and retry logic

#### [NEW] [services/transcript_service.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/services/transcript_service.py)
- YouTube transcript fetching using `youtube-transcript-api`
- Multi-language transcript support
- Auto-generated vs manual transcript detection
- Transcript formatting and chunking for AI processing

#### [NEW] [services/ai_content_analyzer.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/services/ai_content_analyzer.py)
- **AI Feature**: Course summary generation
- **AI Feature**: Topic extraction using NER and embeddings
- **AI Feature**: Difficulty scoring algorithm
- **AI Feature**: Prerequisite detection
- Caching layer to avoid redundant API calls

#### [NEW] [services/ai_quiz_generator.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/services/ai_quiz_generator.py)
- **AI Feature**: Generate MCQs from video content
- **AI Feature**: Difficulty-adaptive question generation
- **AI Feature**: Distractor generation (wrong answer choices)
- **AI Feature**: Explanation generation for answers
- Question validation and quality scoring

#### [NEW] [services/ai_learning_analytics.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/services/ai_learning_analytics.py)
- **AI Feature**: Study pattern analysis
- **AI Feature**: Completion probability prediction (ML model)
- **AI Feature**: Optimal study time recommendations
- **AI Feature**: Struggling topic identification
- **AI Feature**: Personalized intervention suggestions
- Time series forecasting for progress prediction

#### [NEW] [services/adaptive_scheduler.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/services/adaptive_scheduler.py)
- **AI Feature**: Reinforcement learning-based schedule optimization
- Learns from user behavior (completion rates, session lengths)
- Adjusts difficulty distribution across days
- Predicts optimal video sequencing
- A/B testing framework for scheduling strategies

#### [NEW] [utils/embedding_helper.py](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/utils/embedding_helper.py)
- Text embedding generation using Gemini Embeddings API
- Vector similarity search for RAG
- Semantic chunking for long transcripts
- Embedding cache management

---

### Database - Supabase Schema

#### [NEW] [schema.sql](file:///c:/Users/Vincy/Desktop/consistency_lab/database/schema.sql)

**Table: `users`**
- `id` (UUID, PK) - Auto-generated
- `email` (TEXT) - From Google OAuth
- `created_at` (TIMESTAMP)

**Table: `playlists`**
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `youtube_playlist_id` (TEXT)
- `title` (TEXT)
- `total_duration_minutes` (INTEGER)
- `video_count` (INTEGER)
- `created_at` (TIMESTAMP)

**Table: `goals`**
- `id` (UUID, PK)
- `playlist_id` (UUID, FK to playlists)
- `user_id` (UUID, FK to users)
- `study_days` (JSONB) - Array of weekday numbers [0,2,4] for Mon/Wed/Fri
- `hours_per_day` (DECIMAL)
- `start_date` (DATE)
- `target_completion_date` (DATE)
- `created_at` (TIMESTAMP)

**Table: `video_progress`**
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `playlist_id` (UUID, FK to playlists)
- `youtube_video_id` (TEXT)
- `video_title` (TEXT)
- `duration_seconds` (INTEGER)
- `current_timestamp` (INTEGER) - Seconds watched
- `completed` (BOOLEAN)
- `last_watched` (TIMESTAMP)

**Table: `consistency_logs`**
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `goal_id` (UUID, FK to goals)
- `scheduled_date` (DATE)
- `watched` (BOOLEAN)
- `minutes_watched` (INTEGER)
- `created_at` (TIMESTAMP)

**Table: `video_transcripts`** *(AI Cache)*
- `id` (UUID, PK)
- `youtube_video_id` (TEXT, UNIQUE)
- `transcript_text` (TEXT)
- `language` (TEXT)
- `auto_generated` (BOOLEAN)
- `fetched_at` (TIMESTAMP)

**Table: `ai_course_insights`** *(AI Cache)*
- `id` (UUID, PK)
- `playlist_id` (UUID, FK to playlists)
- `summary` (TEXT) - AI-generated overview
- `key_topics` (JSONB) - Array of topics
- `difficulty_level` (TEXT) - Beginner/Intermediate/Advanced
- `prerequisites` (JSONB)
- `learning_objectives` (JSONB)
- `generated_at` (TIMESTAMP)

**Table: `ai_quiz_questions`** *(AI Cache)*
- `id` (UUID, PK)
- `video_id` (UUID, FK to video_progress)
- `question_text` (TEXT)
- `question_type` (TEXT) - MCQ, Short Answer
- `correct_answer` (TEXT)
- `wrong_answers` (JSONB) - Distractors for MCQ
- `explanation` (TEXT)
- `difficulty` (TEXT)
- `generated_at` (TIMESTAMP)

**Table: `ai_chat_history`**
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `playlist_id` (UUID, FK to playlists, nullable)
- `user_message` (TEXT)
- `ai_response` (TEXT)
- `context` (JSONB) - Current video, timestamp, etc.
- `created_at` (TIMESTAMP)

**Table: `ai_learning_insights`**
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `goal_id` (UUID, FK to goals)
- `completion_probability` (DECIMAL) - 0.0 to 1.0
- `optimal_study_times` (JSONB) - Predicted best hours
- `struggling_topics` (JSONB)
- `engagement_score` (DECIMAL)
- `recommendations` (JSONB)
- `generated_at` (TIMESTAMP)

---

### Configuration Files

#### [NEW] [.env.example](file:///c:/Users/Vincy/Desktop/consistency_lab/.env.example)
- Template for environment variables
- YouTube API key
- Supabase URL and keys
- Google OAuth credentials

#### [NEW] [frontend/.env.local.example](file:///c:/Users/Vincy/Desktop/consistency_lab/frontend/.env.local.example)
- Next.js environment variables
- Public Supabase keys
- Backend API URL

#### [NEW] [backend/.env.example](file:///c:/Users/Vincy/Desktop/consistency_lab/backend/.env.example)
- Flask environment variables
- YouTube API credentials
- Supabase service key

## Verification Plan

### Automated Tests

1. **Backend API Tests**
   ```bash
   cd backend
   python -m pytest tests/
   ```
   - Test YouTube API playlist parsing
   - Test duration calculation accuracy
   - Test schedule generation algorithm

2. **Frontend Component Tests**
   ```bash
   cd frontend
   npm run test
   ```
   - Test GoalPicker date calculations
   - Test ConsistencyHeatmap rendering

### Manual Verification

1. **YouTube API Integration**
   - Input a real YouTube playlist URL
   - Verify correct video count and total duration
   - Check that all videos are fetched (pagination test with 100+ video playlist)

2. **Scheduling Logic**
   - Example: 20-hour course, 3 days/week, 2 hours/day
   - Expected: ~3-4 weeks completion time
   - Verify calendar highlights correct days

3. **Progress Tracking**
   - Mark videos as complete
   - Verify heatmap updates in real-time
   - Check that timestamp persists after page refresh

4. **Authentication Flow**
   - Sign in with Google
   - Verify user data stored in Supabase
   - Test that goals are user-specific

5. **Browser Testing**
   - Use browser_subagent to test full user flow
   - Record video demonstration of playlist analysis → goal setting → progress tracking

6. **AI Content Analysis**
   - Test transcript fetching for various video types
   - Verify course summary quality and relevance
   - Check topic extraction accuracy
   - Validate difficulty level predictions

7. **AI Quiz Generation**
   - Generate quizzes for different video types (lecture, tutorial, documentary)
   - Verify question relevance and clarity
   - Test answer validation logic
   - Check explanation quality

8. **AI Learning Assistant**
   - Test chatbot with course-specific questions
   - Verify context awareness (remembers conversation)
   - Test RAG accuracy with transcript retrieval
   - Check response quality and helpfulness

9. **AI Learning Analytics**
   - Verify completion probability predictions
   - Test study pattern analysis with mock data
   - Check recommendation relevance
   - Validate struggling topic identification

10. **AI Performance & Cost**
    - Monitor Gemini API usage and costs
    - Verify caching effectiveness
    - Test response times for all AI features
    - Validate token usage optimization
