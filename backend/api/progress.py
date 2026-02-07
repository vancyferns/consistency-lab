from flask import Blueprint, request, jsonify
from services.gemini_service import get_gemini_response
import os
from datetime import datetime, timedelta
import json

bp = Blueprint('progress', __name__, url_prefix='/api/progress')

# Initialize Supabase
from supabase import create_client, Client
from services.scheduler_service import distribute_videos_to_schedule
from datetime import datetime, date, timedelta
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@bp.route('/save-timestamp', methods=['POST'])
def save_timestamp():
    """Save video timestamp for resume functionality"""
    try:
        data = request.json
        user_id = data.get('user_id')
        video_id = data.get('video_id')
        timestamp = data.get('timestamp')
        duration = data.get('duration')
        
        if not all([user_id, video_id, timestamp]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Calculate progress percentage
        progress_percent = (timestamp / duration * 100) if duration else 0
        
        # TODO: Save to Supabase video_progress table
        # supabase.table('video_progress').upsert({
        #     'user_id': user_id,
        #     'video_id': video_id,
        #     'current_timestamp': timestamp,
        #     'duration': duration,
        #     'progress_percent': progress_percent,
        #     'last_watched': datetime.now().isoformat()
        # }).execute()
        
        return jsonify({
            'success': True,
            'timestamp': timestamp,
            'progress_percent': round(progress_percent, 2)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/mark-complete', methods=['POST'])
def mark_video_complete():
    """Mark a video as completed"""
    try:
        data = request.json
        user_id = data.get('user_id')
        video_id = data.get('video_id')
        playlist_id = data.get('playlist_id')
        completed = data.get('completed', True)
        video_title = data.get('video_title', 'Untitled Video')
        duration_seconds = data.get('duration_seconds', 0)
        
        if not all([user_id, video_id]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        print(f"Marking video {video_id} as completed={completed} for user {user_id}")
        
        # Upsert Video Progress
        progress_data = {
            'user_id': user_id,
            'youtube_video_id': video_id,
            'playlist_id': playlist_id,
            'video_title': video_title,
            'duration_seconds': duration_seconds,
            'completed': completed,
            'last_watched': datetime.now().isoformat()
        }
        
        if completed:
            progress_data['current_position'] = duration_seconds
        else:
            progress_data['current_position'] = 0
            
        # Upsert with on_conflict
        progress_result = supabase.table('video_progress').upsert(progress_data, on_conflict='user_id,youtube_video_id').execute()
        print(f"Video progress upsert result: {progress_result}")
        
        # Log consistency - only when marking as completed
        if completed:
            today = datetime.now().date().isoformat()
            
            # Check if already logged today for this video
            existing_log = supabase.table('consistency_logs').select('id').eq('user_id', user_id).eq('video_id', video_id).eq('date', today).execute()
            
            if not existing_log.data:
                log_data = {
                    'user_id': user_id,
                    'activity_type': 'video_completed',
                    'video_id': video_id,
                    'playlist_id': playlist_id,
                    'date': today,
                    'duration_minutes': int(duration_seconds / 60) if duration_seconds else 0
                }
                log_result = supabase.table('consistency_logs').insert(log_data).execute()
                print(f"Consistency log inserted: {log_result}")
            else:
                print(f"Activity already logged today for video {video_id}")
        
        return jsonify({
            'success': True,
            'completed': completed,
            'message': 'Progress saved! 🎯' if completed else 'Progress updated!'
        })
    
    except Exception as e:
        print(f"Error marking complete: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@bp.route('/log-session', methods=['POST'])
def log_study_session():
    """Log a study session for consistency tracking"""
    try:
        data = request.json
        user_id = data.get('user_id')
        duration_minutes = data.get('duration_minutes')
        notes = data.get('notes', '')
        playlist_id = data.get('playlist_id')
        
        if not all([user_id, duration_minutes]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Save to Supabase
        supabase.table('consistency_logs').insert({
            'user_id': user_id,
            'activity_type': 'study_session',
            'duration_minutes': duration_minutes,
            'notes': notes,
            'playlist_id': playlist_id,
            'date': datetime.now().date().isoformat()
        }).execute()
        
        return jsonify({
            'success': True,
            'message': f'Study session logged! {duration_minutes} minutes added to your streak! 🔥'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/sync-progress/<user_id>', methods=['GET'])
def sync_progress(user_id):
    """Sync progress across sessions"""
    try:
        # TODO: Fetch from Supabase
        # progress = supabase.table('video_progress').select('*').eq('user_id', user_id).execute()
        # consistency = supabase.table('consistency_logs').select('*').eq('user_id', user_id).execute()
        
        # Mock data for now
        mock_data = {
            'videos_completed': 15,
            'current_streak': 7,
            'longest_streak': 12,
            'total_minutes': 450,
            'last_activity': datetime.now().isoformat(),
            'progress': []
        }
        
        return jsonify(mock_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/ai-insights', methods=['POST'])
def generate_ai_insights():
    """Generate AI learning pattern insights"""
    try:
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'Missing user_id'}), 400
        
        # TODO: Fetch user's learning data from Supabase
        # learning_data = supabase.table('video_progress').select('*').eq('user_id', user_id).execute()
        # consistency_data = supabase.table('consistency_logs').select('*').eq('user_id', user_id).execute()
        
        # Mock data for AI analysis
        mock_learning_data = {
            'videos_watched': 20,
            'completion_rate': 75,
            'avg_session_duration': 45,
            'active_days': [1, 3, 5],  # Mon, Wed, Fri
            'consistency_score': 85
        }
        
        prompt = f"""
        Analyze this learner's behavior and provide insights:
        
        Data:
        - Videos watched: {mock_learning_data['videos_watched']}
        - Completion rate: {mock_learning_data['completion_rate']}%
        - Average session: {mock_learning_data['avg_session_duration']} minutes
        - Consistency score: {mock_learning_data['consistency_score']}/100
        
        Provide:
        1. Learning Pattern Analysis (2-3 sentences)
        2. Completion Probability for current course (percentage with reasoning)
        3. Optimal Review Times (suggest 3 specific times based on spaced repetition)
        4. Actionable Recommendations (3 tips)
        
        Format as JSON with keys: pattern_analysis, completion_probability, optimal_review_times, recommendations
        """
        
        ai_response = get_gemini_response(prompt)
        
        # Try to parse as JSON, fallback to structured text
        try:
            insights = json.loads(ai_response)
        except:
            insights = {
                'pattern_analysis': ai_response[:200],
                'completion_probability': '78% based on current consistency',
                'optimal_review_times': ['Day 1', 'Day 3', 'Day 7'],
                'recommendations': ['Keep consistent schedule', 'Review previous topics', 'Take breaks']
            }
        
        # TODO: Save insights to database
        # supabase.table('ai_learning_insights').insert({
        #     'user_id': user_id,
        #     'insights': insights,
        #     'generated_at': datetime.now().isoformat()
        # }).execute()
        
        return jsonify({
            'success': True,
            'insights': insights
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/predict-completion', methods=['POST'])
def predict_completion():
    """AI-powered completion probability prediction"""
    try:
        data = request.json
        user_id = data.get('user_id')
        playlist_id = data.get('playlist_id')
        
        # TODO: Fetch real data
        # user_data = supabase.table('video_progress').select('*')...
        
        prompt = """
        Based on these learning patterns:
        - Current streak: 7 days
        - Videos completed: 15/40
        - Average daily progress: 2 videos
        - Missed sessions: 2 in last week
        
        Predict the probability of completing this course and provide:
        1. Completion probability (0-100%)
        2. Estimated completion date
        3. Risk factors
        4. Success boosters
        
        Format as JSON.
        """
        
        ai_response = get_gemini_response(prompt)
        
        return jsonify({
            'success': True,
            'prediction': ai_response
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/courses', methods=['GET'])
def get_user_courses():
    """Fetch all active courses for a user"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'Missing user_id'}), 400
            
        # Fetch goals with related playlist details
        # Using Supabase's relational query syntax
        response = supabase.table('goals').select('*, playlists(*)').eq('user_id', user_id).execute()
        
        return jsonify({
            'success': True,
            'courses': response.data
        }), 200
    
    except Exception as e:
        print(f"Error fetching courses: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/course/<goal_id>', methods=['GET'])
def get_course_details(goal_id):
    """Get full course details including videos and progress"""
    try:
        # 1. Get Goal & Playlist info from DB
        res = supabase.table('goals').select('*, playlists(*)').eq('id', goal_id).execute()
        
        if not res.data:
            return jsonify({'error': 'Goal not found'}), 404
            
        goal = res.data[0]
        playlist = goal['playlists'] # Relationship result
        
        # Determine playlist ID to use for API
        playlist_api_id = playlist['youtube_playlist_id']
        
        # 2. Get Videos from YouTube Service
        from services.youtube_service import fetch_playlist_items, get_video_durations
        
        raw_videos = fetch_playlist_items(playlist_api_id)
        # Process in chunks if needed
        videos = get_video_durations(raw_videos)
            
        # 3. Get User Progress
        user_id = goal['user_id']
        # Note: video_progress table stores progress by video_id
        # We fetch all progress records for this playlist_id
        progress_res = supabase.table('video_progress').select('*').eq('playlist_id', playlist['id']).eq('user_id', user_id).execute()
        
        progress_map = {}
        if progress_res.data:
            for p in progress_res.data:
                progress_map[p['youtube_video_id']] = p
        
        # 4. Merge Progress
        processed_videos = []
        for vid in videos:
            vid_id = vid['video_id']
            p = progress_map.get(vid_id)
            
            vid['completed'] = p['completed'] if p else False
            # Add other progress details if needed
            processed_videos.append(vid)
            
        # 5. Generate Schedule Grouping
        # We recalculate the schedule to group videos by day
        # Ensure dates are parsed correctly
        start_date = datetime.strptime(goal['start_date'], '%Y-%m-%d').date() if isinstance(goal['start_date'], str) else goal['start_date']
        
        # Calculate daily minutes from hours
        daily_minutes = int(goal.get('hours_per_day', 1) * 60)
        
        schedule_list = distribute_videos_to_schedule(
            videos=processed_videos,
            study_days=goal['study_days'],
            daily_minutes=daily_minutes,
            start_date=start_date
        )
        
        schedule = {
            'study_sessions': schedule_list,
            'total_days': len(schedule_list),
            'completion_date': schedule_list[-1]['date'] if schedule_list else goal['target_completion_date']
        }

        return jsonify({
            'success': True,
            'goal': goal,
            'playlist': playlist,
            'videos': processed_videos, # Flat list
            'schedule': schedule # Structured object
        }), 200
        
    except Exception as e:
        print(f"Error fetching course details: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/stats', methods=['GET'])
def get_user_stats():
    """Get calculated gamification stats for user"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'Missing user_id'}), 400
            
        # 1. Count Completed Videos (Approx count is faster)
        vid_res = supabase.table('video_progress').select('id', count='exact').eq('user_id', user_id).eq('completed', True).execute()
        completed_videos = vid_res.count 
        
        # 2. Count Total Sessions
        log_res = supabase.table('consistency_logs').select('id', count='exact').eq('user_id', user_id).execute()
        total_sessions = log_res.count 
        
        # 3. Calculate Streak
        # New logic: if current date matches last activity date, add 1, else reset to 0
        dates_res = supabase.table('consistency_logs').select('date').eq('user_id', user_id).order('date', desc=True).limit(50).execute()
        
        streak = 0
        if dates_res.data:
            # Extract unique dates
            raw_dates = [d['date'] for d in dates_res.data]
            unique_dates = sorted(list(set(raw_dates)), reverse=True)
            
            today = datetime.now().date()
            last_logged_date_str = unique_dates[0]
            last_logged_date = datetime.strptime(last_logged_date_str, '%Y-%m-%d').date()
            
            # If user logged activity today, count consecutive days
            if last_logged_date == today:
                streak = 1
                current_check = last_logged_date
                
                # Count backwards for consecutive days
                for i in range(1, len(unique_dates)):
                    prev_date_str = unique_dates[i]
                    prev_date = datetime.strptime(prev_date_str, '%Y-%m-%d').date()
                    
                    expected_prev = current_check - timedelta(days=1)
                    if prev_date == expected_prev:
                        streak += 1
                        current_check = prev_date
                    else:
                        break
            else:
                # If user skipped (last activity was before today), streak is 0
                streak = 0

        # XP Calculation
        xp = (completed_videos * 100) + (total_sessions * 50)
        level = int(xp / 500) + 1
        return jsonify({
            'success': True,
            'level': level,
            'xp': xp,
            'next_level_xp': level * 500,
            'streak': streak,
            'total_videos': completed_videos
        })

    except Exception as e:
        print(f"Error calculating stats: {e}")
        return jsonify({
            'success': False, 
            'level': 1, 'xp': 0, 'next_level_xp': 500, 'streak': 0, 'total_videos': 0
        })

@bp.route('/logs', methods=['GET'])
def get_user_logs():
    """Get recent activity logs for a user"""
    try:
        user_id = request.args.get('user_id')
        limit = request.args.get('limit', 10, type=int)
        
        if not user_id:
            return jsonify({'error': 'Missing user_id'}), 400
        
        # Fetch recent logs
        logs_res = supabase.table('consistency_logs').select('*').eq('user_id', user_id).order('date', desc=True).limit(limit).execute()
        
        return jsonify({
            'success': True,
            'logs': logs_res.data or []
        })
    
    except Exception as e:
        print(f"Error fetching logs: {e}")
        return jsonify({
            'success': False,
            'logs': []
        })

