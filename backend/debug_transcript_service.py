import sys
import os
sys.path.append(os.getcwd())  # Add current directory to path

from services.youtube_service import fetch_playlist_items
from services.transcript_service import get_video_transcript
from youtube_transcript_api import YouTubeTranscriptApi

PLAYLIST_ID = "PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E" # Programming with Mosh - Python

print(f"Fetching playlist {PLAYLIST_ID}...")
videos = fetch_playlist_items(PLAYLIST_ID)

if not videos:
    print("❌ Failed to fetch playlist items")
    exit(1)

first_video = videos[0]
print(f"DEBUG: First item keys: {first_video.keys()}")
# Based on common usage, it might be flat or nested
if 'snippet' in first_video:
    title = first_video['snippet']['title']
    video_id = first_video['snippet']['resourceId']['videoId']
else:
    # Assuming flattened structure
    title = first_video.get('title', 'Unknown Title')
    video_id = first_video.get('video_id', first_video.get('id'))

print(f"\n🎥 First Video: {title}")
print(f"🆔 Video ID: {video_id}")
print(f"\n🎥 First Video: {title}")
print(f"🆔 Video ID: {video_id}")

print("\nTrying to fetch transcript...")
try:
    transcript = get_video_transcript(video_id)
    if transcript:
        print(f"✅ Transcript FOUND! Length: {len(transcript)} chars")
        print(f"Preview: {transcript[:100]}...")
    else:
        print("❌ Transcript NOT FOUND (returned None)")
        
        # Debug why
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            print("\nAvailable transcripts:")
            for t in transcript_list:
                print(f" - {t.language} ({t.language_code}) [Generated: {t.is_generated}]")
        except Exception as e:
            print(f"\n❌ Error listing transcripts: {e}")

except Exception as e:
    print(f"❌ Error calling get_video_transcript: {e}")
