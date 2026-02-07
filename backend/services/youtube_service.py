from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
import isodate
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

def fetch_playlist_items(playlist_id: str) -> list:
    """
    Fetch all videos from a YouTube playlist
    
    Args:
        playlist_id: YouTube playlist ID
    
    Returns:
        List of video dictionaries
    """
    try:
        videos = []
        next_page_token = None
        
        while True:
            request = youtube.playlistItems().list(
                part='snippet,contentDetails',
                playlistId=playlist_id,
                maxResults=50,
                pageToken=next_page_token
            )
            response = request.execute()
            
            for item in response['items']:
                video = {
                    'video_id': item['contentDetails']['videoId'],
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'thumbnail': item['snippet']['thumbnails']['default']['url'],
                    'playlist_title': item['snippet'].get('channelTitle', 'Unknown')
                }
                videos.append(video)
            
            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break
        
        return videos
        
    except HttpError as e:
        print(f"YouTube API error: {e}")
        raise

def get_video_durations(videos: list) -> list:
    """
    Get duration for each video
    
    Args:
        videos: List of video dictionaries with 'video_id'
    
    Returns:
        Updated list with 'duration_seconds' field
    """
    try:
        video_ids = [v['video_id'] for v in videos]
        
        # YouTube API allows max 50 IDs per request
        for i in range(0, len(video_ids), 50):
            batch_ids = video_ids[i:i+50]
            
            request = youtube.videos().list(
                part='contentDetails',
                id=','.join(batch_ids)
            )
            response = request.execute()
            
            for idx, item in enumerate(response['items']):
                duration_iso = item['contentDetails']['duration']
                duration_seconds = int(isodate.parse_duration(duration_iso).total_seconds())
                
                # Find matching video and add duration
                for video in videos:
                    if video['video_id'] == item['id']:
                        video['duration_seconds'] = duration_seconds
                        video['duration_formatted'] = format_duration(duration_seconds)
                        break
        
        return videos
        
    except HttpError as e:
        print(f"YouTube API error: {e}")
        raise

def format_duration(seconds: int) -> str:
    """Convert seconds to HH:MM:SS format"""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    
    if hours > 0:
        return f"{hours}h {minutes}m {secs}s"
    elif minutes > 0:
        return f"{minutes}m {secs}s"
    else:
        return f"{secs}s"
