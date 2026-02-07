import requests
import json

BASE_URL = "http://localhost:5000"

# First Video from the user's playlist
# "FREE Azure DevOps Full Course for Beginners"
# ID we found: A_N5oHwwmTQ (Wait, is it?)
# My debug output earlier showed: "Video ID: A_N5oHwwmTQ"

VIDEO_ID = "A_N5oHwwmTQ" 

print(f"Testing Summarize Endpoint for Video: {VIDEO_ID}")
print("="*60)

payload = {
    "video_id": VIDEO_ID
}

try:
    response = requests.post(
        f"{BASE_URL}/api/ai/summarize",
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=60 # Give Gemini some time
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.ok:
        data = response.json()
        print("\n✅ SUCCESS! Summary Generated:")
        print("="*60)
        print(f"Summary: {data.get('summary', 'N/A')[:200]}...")
        print(f"Topics: {data.get('key_topics', [])}")
        print(f"Difficulty: {data.get('difficulty_level', 'N/A')}")
    else:
        print(f"\n❌ Error: {response.text}")

except Exception as e:
    print(f"\n❌ Exception: {e}")
