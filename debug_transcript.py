from youtube_transcript_api import YouTubeTranscriptApi

video_id = "PLl4APkPHzsTfRDzr2hivbD" # Wait, this looks like a playlist ID?
# The video ID should be extracted properly.
# The previous user command said: PLl4APkPHzsUXseJO1a03CtfRDzr2hivbD
# Let me get the actual video ID from the playlist.
# The first video in that playlist is "FREE Azure DevOps Full Course for Beginners"
# I'll search for it or just try a known video ID from that channel.

# Let's try to fetch the playlist items first to get a valid video ID
import requests
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
API_KEY = os.getenv('YOUTUBE_API_KEY')
PLAYLIST_ID = "PLl4APkPHzsUXseJO1a03CtfRDzr2hivbD"

url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId={PLAYLIST_ID}&key={API_KEY}"
response = requests.get(url)
data = response.json()

if 'items' in data and len(data['items']) > 0:
    video_id = data['items'][0]['snippet']['resourceId']['videoId']
    print(f"Testing video ID: {video_id}")
    
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        print("Available transcripts:")
        for transcript in transcript_list:
            print(f" - {transcript.language} ({transcript.language_code}) - {transcript.is_generated}")
            
    except Exception as e:
        print(f"Error: {e}")
else:
    print("Could not fetch playlist items")
