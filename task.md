# Consistency Lab - Task Breakdown

## Phase 1: Foundation & Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Install and configure shadcn/ui components
- [ ] Set up Python Flask backend structure
- [ ] Configure Supabase client and environment variables
- [ ] Create database schema (Playlists, Goals, Logs, Users, AI Insights)
- [ ] Implement Google OAuth authentication
- [/] Set up Gemini API integration for AI features

## Phase 2: YouTube API Integration + AI Content Analysis
- [ ] Set up YouTube Data API v3 credentials
- [ ] Create Flask endpoint to fetch playlist metadata
- [ ] Implement video transcript fetching (YouTube Transcript API)
- [ ] Implement duration calculation logic
- [ ] Store playlist data in Supabase
- [ ] **AI: Generate course summaries using Gemini API**
- [ ] **AI: Extract key topics and learning objectives from transcripts**
- [ ] **AI: Analyze content difficulty level**
- [ ] Handle API rate limits and errors

## Phase 3: Adaptive Scheduling Engine (AI-Enhanced)
- [ ] Build "3-Day Logic" algorithm in Flask
- [ ] Create calendar date mapping system
- [ ] Calculate dynamic deadlines based on availability
- [ ] Generate personalized study schedules
- [ ] **AI: Predict optimal study times based on user behavior**
- [ ] **AI: Adjust schedule difficulty based on progress patterns**
- [ ] **AI: Identify struggling topics for schedule adjustment**
- [ ] Store and retrieve user goals

## Phase 4: Frontend Dashboard + AI Assistant
- [ ] Create main dashboard layout
- [ ] Build playlist input component
- [ ] Implement goal picker with Calendar component
- [ ] Create progress bar visualization
- [ ] Add consistency heatmap component
- [ ] Build "Smart Nudge" next lecture indicator
- [ ] **AI: Add conversational learning assistant chatbot**
- [ ] **AI: Display AI-generated course insights**
- [ ] **AI: Show personalized learning recommendations**

## Phase 5: Progress Tracking + AI Analytics
- [x] Implement video timestamp saving
- [x] Create "Video Completed" event handler
- [x] Build consistency log system
- [x] Update heatmap based on watch history
- [x] Sync progress across sessions
- [x] **AI: Generate learning pattern insights**
- [x] **AI: Predict completion probability**
- [x] **AI: Identify optimal review times (spaced repetition)**

## Phase 6: AI-Powered Learning Tools
- [x] **AI: Automated quiz generation from video content**
- [x] **AI: Flashcard generation for key concepts**
- [x] **AI: Video summary generation**
- [x] **AI: Chapter/timestamp recommendations**
- [x] **AI: Personalized note suggestions**
- [x] **AI: Learning style adaptation**

## Phase 7: Testing & Refinement
- [x] Test YouTube API integration
- [x] Verify scheduling calculations
- [x] Test progress persistence
- [x] Test AI response quality and accuracy
- [x] Verify quiz generation relevance
- [x] Test chatbot conversational abilities
- [x] UI/UX refinement
- [x] Performance optimization
- [x] AI cost optimization (caching, prompt engineering)

