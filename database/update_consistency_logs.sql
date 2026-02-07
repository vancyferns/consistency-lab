-- Drop the old table that doesn't match our code
DROP TABLE IF EXISTS consistency_logs;

-- Re-create consistency_logs with the correct columns matching backend/api/progress.py
CREATE TABLE consistency_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- e.g., 'video_completed', 'study_session'
    video_id TEXT, -- YouTube Video ID
    playlist_id UUID REFERENCES playlists(id) ON DELETE SET NULL,
    date DATE NOT NULL, -- The date of activity (YYYY-MM-DD)
    duration_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE consistency_logs ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own logs" ON consistency_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON consistency_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON consistency_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs" ON consistency_logs FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster stats/streak calculation
CREATE INDEX idx_consistency_logs_user_date ON consistency_logs(user_id, date);
