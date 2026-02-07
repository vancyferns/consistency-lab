from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

def get_video_transcript(video_id: str, language: str = 'en') -> str:
    """
    Fetch transcript for a YouTube video with robust fallback
    
    Args:
        video_id: YouTube video ID
        language: Preferred language code (default: 'en')
    
    Returns:
        Transcript text as a single string, or None if not available
    """
    print(f"DEBUG: Fetching transcript for {video_id}...")
    try:
        # Get list of all available transcripts
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        transcript = None
        
        # Strategy 1: Try exact language match
        try:
            transcript = transcript_list.find_transcript([language])
            print(f"DEBUG: Found preferred transcript: {language}")
        except:
            print(f"DEBUG: Preferred language '{language}' not found.")
            
        # Strategy 2: If no preferred, try English (any type)
        if not transcript and language != 'en':
            try:
                transcript = transcript_list.find_transcript(['en'])
                print("DEBUG: Found English fallback.")
            except:
                pass
                
        # Strategy 3: Iterate through all available transcripts
        if not transcript:
            print("DEBUG: Iterating through all available transcripts...")
            for t in transcript_list:
                # Prefer not generated if possible, but take what we can get
                if not t.is_generated:
                    transcript = t
                    print(f"DEBUG: Selected fallback (manual): {t.language_code}")
                    break
            
            # If still nothing, take the first one (auto-generated)
            if not transcript:
                for t in transcript_list:
                    transcript = t
                    print(f"DEBUG: Selected final fallback (auto): {t.language_code}")
                    break
        
        if not transcript:
            print("DEBUG: No transcript object found after all strategies.")
            return None
            
        # Fetch the actual text
        print(f"DEBUG: Fetching text for {transcript.language_code}...")
        transcript_data = transcript.fetch()
        full_text = ' '.join([entry['text'] for entry in transcript_data])
        print(f"DEBUG: Successfully fetched {len(full_text)} chars.")
        
        return full_text
        
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        print(f"DEBUG: Transcript Disabled/Not Found for {video_id}: {e}")
        return None
    except Exception as e:
        print(f"DEBUG: Critical error fetching transcript for {video_id}: {e}")
        return None

def chunk_transcript(transcript: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """
    Split transcript into overlapping chunks for embedding
    
    Args:
        transcript: Full transcript text
        chunk_size: Number of words per chunk
        overlap: Number of overlapping words between chunks
    
    Returns:
        List of text chunks
    """
    words = transcript.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        chunks.append(chunk)
        
        if i + chunk_size >= len(words):
            break
    
    return chunks
