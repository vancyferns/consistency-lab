-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users table (auto-created by Supabase Auth, but we reference it)

-- Playlists table
CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    youtube_playlist_id TEXT NOT NULL,
    title TEXT NOT NULL,
    total_duration_minutes INTEGER NOT NULL,
    video_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, youtube_playlist_id)
);

-- Goals table
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_days JSONB NOT NULL, -- Array of weekday numbers [0,2,4] for Mon/Wed/Fri
    hours_per_day DECIMAL(4,2) NOT NULL,
    start_date DATE NOT NULL,
    target_completion_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video progress table
CREATE TABLE video_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    youtube_video_id TEXT NOT NULL,
    video_title TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    current_position INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, youtube_video_id)
);

-- Consistency logs table
CREATE TABLE consistency_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    watched BOOLEAN DEFAULT FALSE,
    minutes_watched INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Cache: Video transcripts
CREATE TABLE video_transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    youtube_video_id TEXT UNIQUE NOT NULL,
    transcript_text TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    auto_generated BOOLEAN DEFAULT TRUE,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Cache: Course insights
CREATE TABLE ai_course_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    key_topics JSONB NOT NULL,
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    prerequisites JSONB,
    learning_objectives JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(playlist_id)
);

-- AI Cache: Quiz questions
CREATE TABLE ai_quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES video_progress(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'Short Answer')),
    correct_answer TEXT NOT NULL,
    wrong_answers JSONB, -- For MCQ distractors
    explanation TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chat history
CREATE TABLE ai_chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    playlist_id UUID REFERENCES playlists(id) ON DELETE SET NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context JSONB, -- Current video, timestamp, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Learning insights
CREATE TABLE ai_learning_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    completion_probability DECIMAL(3,2) CHECK (completion_probability BETWEEN 0 AND 1),
    optimal_study_times JSONB,
    struggling_topics JSONB,
    engagement_score DECIMAL(3,2),
    recommendations JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, goal_id)
);

-- Vector embeddings for RAG
CREATE TABLE video_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(768),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(video_id, chunk_index)
);

-- Create indexes for better query performance
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_video_progress_user_id ON video_progress(user_id);
CREATE INDEX idx_consistency_logs_user_id ON consistency_logs(user_id);
CREATE INDEX idx_ai_chat_history_user_id ON ai_chat_history(user_id);

-- Vector similarity search index
CREATE INDEX ON video_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Row Level Security (RLS) Policies
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE consistency_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_insights ENABLE ROW LEVEL SECURITY;

-- Playlists policies
CREATE POLICY "Users can view own playlists" ON playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own playlists" ON playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON playlists FOR DELETE USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

-- Video progress policies
CREATE POLICY "Users can view own progress" ON video_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON video_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON video_progress FOR UPDATE USING (auth.uid() = user_id);

-- Consistency logs policies
CREATE POLICY "Users can view own logs" ON consistency_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON consistency_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat history policies
CREATE POLICY "Users can view own chat" ON ai_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat" ON ai_chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Learning insights policies
CREATE POLICY "Users can view own insights" ON ai_learning_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insights" ON ai_learning_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own insights" ON ai_learning_insights FOR UPDATE USING (auth.uid() = user_id);
