# Stats and Streak Fix - Issues and Solutions

## Problems Identified

### 1. **Database Schema Mismatch**
The `consistency_logs` table in your database has a different structure than what the backend code expects.

**Original Schema** (in database):
```sql
CREATE TABLE consistency_logs (
    id UUID PRIMARY KEY,
    user_id UUID,
    goal_id UUID,           -- ❌ Code doesn't use this
    scheduled_date DATE,    -- ❌ Code uses 'date' instead
    watched BOOLEAN,        -- ❌ Code doesn't use this
    minutes_watched INT,    -- ❌ Code uses 'duration_minutes'
    created_at TIMESTAMP
);
```

**Expected Schema** (what backend code needs):
```sql
CREATE TABLE consistency_logs (
    id UUID PRIMARY KEY,
    user_id UUID,
    activity_type TEXT,     -- ✅ 'video_completed', 'study_session'
    video_id TEXT,          -- ✅ YouTube video ID
    playlist_id UUID,       -- ✅ Reference to playlist
    date DATE,              -- ✅ Activity date (YYYY-MM-DD)
    duration_minutes INT,   -- ✅ Duration in minutes
    notes TEXT,             -- ✅ Optional notes
    created_at TIMESTAMP
);
```

### 2. **Field Name Inconsistency in video_progress**
In `backend/api/progress.py` line 326, the code was reading `p['video_id']` but the schema column is `youtube_video_id`.

### 3. **Stats Not Updating**
Because the `consistency_logs` inserts were failing (due to schema mismatch), the `/api/progress/stats` endpoint couldn't calculate streaks properly.

## Solutions Applied

### ✅ Fix 1: Updated Main Schema File
Updated `database/schema.sql` to have the correct `consistency_logs` structure that matches the backend code.

### ✅ Fix 2: Fixed Field Name in Backend
Fixed `backend/api/progress.py` line 326 to use `youtube_video_id` instead of `video_id`.

### ✅ Fix 3: Created Migration Script
Created `database/migrate_consistency_logs.sql` to safely migrate your existing database.

## How to Apply the Fix

### Step 1: Run the Database Migration
1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `database/migrate_consistency_logs.sql`
4. Click **Run**

⚠️ **Warning**: This will drop existing consistency_logs data. If you have important data, export it first.

### Step 2: Restart Your Backend
```bash
# Make sure backend picks up the latest code changes
cd backend
# If you have a virtual environment, activate it
python app.py
```

### Step 3: Test the Fix
1. Go to your app dashboard
2. Mark a video as complete
3. Check that:
   - The video stays marked as complete
   - Your XP increases
   - Your streak updates
   - The stats show correct numbers

## What Should Work Now

### ✅ Video Completion Tracking
- When you mark a video complete, it now properly logs to `consistency_logs`
- The log includes: `activity_type='video_completed'`, `video_id`, `playlist_id`, `date`

### ✅ Streak Calculation
The `/api/progress/stats` endpoint calculates streaks by:
1. Getting all unique dates from `consistency_logs` for the user
2. Sorting them in descending order
3. Checking if the most recent activity was today or yesterday
4. Counting consecutive days backwards

### ✅ Stats Display
- **Level**: Based on total XP (every 500 XP = 1 level)
- **XP**: (completed_videos × 100) + (total_sessions × 50)
- **Streak**: Consecutive days with activity
- **Total Videos**: Count of completed videos

## Verification Steps

1. **Check Database Structure**:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'consistency_logs';
   ```
   Should show: `activity_type`, `video_id`, `playlist_id`, `date`, `duration_minutes`, `notes`

2. **Test Activity Logging**:
   ```sql
   -- After marking a video complete, check logs
   SELECT * FROM consistency_logs 
   WHERE user_id = 'your-user-id' 
   ORDER BY date DESC 
   LIMIT 5;
   ```

3. **Verify Stats API**:
   ```bash
   curl "http://localhost:5000/api/progress/stats?user_id=your-user-id"
   ```

## Files Changed

1. ✅ `database/schema.sql` - Updated consistency_logs definition
2. ✅ `backend/api/progress.py` - Fixed field name mismatch
3. ✅ `database/migrate_consistency_logs.sql` - New migration script

## Next Steps

1. Run the migration script in Supabase
2. Test video completion and check stats
3. If issues persist, check browser console and backend logs for errors
4. Verify your Supabase connection is working (check `.env` file)

## Common Issues After Migration

**Issue**: "Stats still showing 0"
- **Solution**: Make sure you mark at least one video as complete after running the migration

**Issue**: "Streak not updating"
- **Solution**: Check that activities are being logged with today's date in `consistency_logs`

**Issue**: "Video completion not persisting"
- **Solution**: Check `video_progress` table - ensure `youtube_video_id` field exists

## Database Backup Recommendation

Before running the migration, backup your existing data:
```sql
-- Export existing consistency_logs (if any)
SELECT * FROM consistency_logs;
```

Save the results to a CSV file from Supabase dashboard.
