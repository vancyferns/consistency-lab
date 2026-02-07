from flask import Blueprint, request, jsonify
from services.scheduler_service import calculate_completion_date, generate_study_schedule, distribute_videos_to_schedule
from datetime import datetime
import os
from supabase import create_client, Client

# Initialize Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

bp = Blueprint('schedule', __name__, url_prefix='/api/schedule')

@bp.route('/generate', methods=['POST'])
def generate_schedule():
    """
    Generate a personalized study schedule
    
    Request body:
        {
            "total_duration_minutes": int,
            "study_days": [0, 2, 4],  // Mon, Wed, Fri (0=Mon, 6=Sun)
            "hours_per_day": float,
            "start_date": "2024-01-01",
            "videos": [...] // Optional: List of videos for detailed assignment
        }
    """
    try:
        data = request.get_json()
        
        total_duration_minutes = data.get('total_duration_minutes')
        study_days = data.get('study_days')  # e.g., [0, 2, 4]
        hours_per_day = data.get('hours_per_day')
        start_date_str = data.get('start_date')
        videos = data.get('videos', [])
        
        # Validation
        if not all([total_duration_minutes is not None, study_days, hours_per_day]):
             return jsonify({'error': 'Missing required fields'}), 400
        
        # Parse start date
        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        else:
            start_date = datetime.now().date()
            
        if videos:
            # Generate detailed video-by-video schedule
            daily_minutes = int(hours_per_day * 60)
            schedule = distribute_videos_to_schedule(
                videos=videos,
                study_days=study_days,
                daily_minutes=daily_minutes,
                start_date=start_date
            )
            
            if not schedule:
                return jsonify({'error': 'Could not generate schedule (no videos or days)'}), 400
                
            last_session = schedule[-1]
            completion_date = datetime.strptime(last_session['date'], '%Y-%m-%d').date()
            study_sessions = len(schedule)
            total_days = (completion_date - start_date).days + 1
            
        else:
            # Fallback to simple estimation logic
            completion_date, total_days, study_sessions = calculate_completion_date(
                total_duration_minutes,
                study_days,
                hours_per_day,
                start_date
            )
            
            schedule = generate_study_schedule(
                study_days,
                hours_per_day,
                start_date,
                completion_date
            )
        
        return jsonify({
            'start_date': start_date.isoformat(),
            'completion_date': completion_date.isoformat(),
            'total_days': total_days,
            'study_sessions': study_sessions,
            'average_hours_per_week': len(study_days) * hours_per_day,
            'schedule': schedule  # Return full schedule for now
        }), 200
        
    except Exception as e:
        print(f"Error generating schedule: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/save', methods=['POST'])
def save_schedule():
    """
    Save generated schedule to database
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        schedule_data = data.get('schedule_data')
        playlist_data = data.get('playlist_data')
        
        if not all([user_id, schedule_data, playlist_data]):
            return jsonify({'error': 'Missing required fields'}), 400
            
        # 1. Insert/Get Playlist
        youtube_playlist_id = playlist_data.get('playlist_id')
        
        # Check if exists
        res = supabase.table('playlists').select('id').eq('user_id', user_id).eq('youtube_playlist_id', youtube_playlist_id).execute()
        
        if res.data:
            playlist_db_id = res.data[0]['id']
        else:
            # Insert new playlist
            new_playlist = {
                'user_id': user_id,
                'youtube_playlist_id': youtube_playlist_id,
                'title': playlist_data.get('title'),
                'total_duration_minutes': playlist_data.get('total_duration_minutes', 0),
                'video_count': playlist_data.get('video_count', 0)
            }
            res = supabase.table('playlists').insert(new_playlist).execute()
            playlist_db_id = res.data[0]['id']
            
        # 2. Insert Goal
        goal_data = {
            'user_id': user_id,
            'playlist_id': playlist_db_id,
            'study_days': data.get('study_days', []),
            'hours_per_day': data.get('hours_per_day', 1),
            'start_date': schedule_data.get('start_date'),
            'target_completion_date': schedule_data.get('completion_date')
        }
        
        res = supabase.table('goals').insert(goal_data).execute()
        goal_id = res.data[0]['id']
        
        # 3. Initialize Video Progress (Optional but good)
        # We can do this in background or batch insert
        # For now, we'll skip to keep it fast, or insert first few
        
        return jsonify({
            'message': 'Schedule saved successfully',
            'goal_id': goal_id,
            'playlist_id': playlist_db_id
        }), 201
        
    except Exception as e:
        print(f"Error saving schedule: {e}")
        return jsonify({'error': str(e)}), 500
