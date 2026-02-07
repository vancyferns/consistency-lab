from flask import Blueprint, request, jsonify
from services.youtube_service import fetch_playlist_items, get_video_durations
from services.transcript_service import get_video_transcript
from services.ai_content_analyzer import generate_course_summary
import json

bp = Blueprint('playlist', __name__, url_prefix='/api/playlist')

@bp.route('/analyze', methods=['POST'])
def analyze_playlist():
    """
    Analyze a YouTube playlist
    
    Request body:
        {
            "playlist_id": "PLxxx" or "https://youtube.com/playlist?list=PLxxx"
        }
    
    Returns:
        {
            "playlist_id": str,
            "title": str,
            "total_duration_minutes": int,
            "video_count": int,
            "videos": [...],
            "ai_summary": {...} (if available)
        }
    """
    try:
        data = request.get_json()
        playlist_input = data.get('playlist_id', '')
        
        # Extract playlist ID from URL if needed
        if 'list=' in playlist_input:
            playlist_id = playlist_input.split('list=')[1].split('&')[0]
        else:
            playlist_id = playlist_input
        
        # Fetch playlist items
        videos = fetch_playlist_items(playlist_id)
        
        if not videos:
            return jsonify({'error': 'Playlist not found or is empty'}), 404
        
        # Get video durations
        videos_with_durations = get_video_durations(videos)
        
        # Calculate total duration
        total_seconds = sum(video['duration_seconds'] for video in videos_with_durations)
        total_minutes = round(total_seconds / 60)
        
        result = {
            'playlist_id': playlist_id,
            'title': videos_with_durations[0].get('playlist_title', 'Untitled Playlist'),
            'total_duration_minutes': total_minutes,
            'video_count': len(videos_with_durations),
            'videos': videos_with_durations,
            'total_videos': len(videos_with_durations)
        }
        
        # Optionally generate AI summary (can be done async client-side)
        if data.get('generate_summary', False):
            try:
                # Get first video transcript for summary
                first_video_id = videos_with_durations[0]['video_id']
                transcript = get_video_transcript(first_video_id)
                
                if transcript:
                    summary = generate_course_summary(transcript[:5000])  # First 5000 chars
                    result['ai_summary'] = summary
            except Exception as e:
                print(f"Could not generate summary: {e}")
                result['ai_summary'] = None
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/video/<video_id>/transcript', methods=['GET'])
def get_transcript(video_id):
    """Get transcript for a specific video"""
    try:
        transcript = get_video_transcript(video_id)
        
        if not transcript:
            return jsonify({'error': 'Transcript not available'}), 404
        
        return jsonify({
            'video_id': video_id,
            'transcript': transcript
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
