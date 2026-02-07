import requests
import json

# Test the user's playlist
playlist_url = "https://youtube.com/playlist?list=PLl4APkPHzsUXseJO1a03CtfRDzr2hivbD&si=CwtzSMCtWCYw0W23"

# Extract playlist ID
playlist_id = "PLl4APkPHzsUXseJO1a03CtfRDzr2hivbD"

print("Testing User's Playlist...")
print("="*60)
print(f"URL: {playlist_url}")
print(f"Playlist ID: {playlist_id}")
print("="*60)

# Call the API
BASE_URL = "http://localhost:5000"
payload = {
    "playlist_id": playlist_id
}

try:
    response = requests.post(
        f"{BASE_URL}/api/playlist/analyze",
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    print(f"\nStatus Code: {response.status_code}")
    
    if response.ok:
        data = response.json()
        print("\n✅ SUCCESS! Playlist analyzed!")
        print("="*60)
        print(f"📚 Playlist Title: {data.get('title', 'N/A')}")
        print(f"🎬 Video Count: {data.get('video_count', 0)}")
        print(f"⏱️  Total Duration: {data.get('total_duration_minutes', 0)} minutes ({data.get('total_duration_minutes', 0)/60:.1f} hours)")
        print(f"📊 Estimated Weeks (3h/week): {data.get('total_duration_minutes', 0)/(3*60):.1f}")
        
        if data.get('videos'):
            print(f"\n📹 First 5 Videos:")
            for i, video in enumerate(data['videos'][:5], 1):
                print(f"   {i}. {video.get('title', 'N/A')[:60]}...")
                print(f"      Duration: {video.get('duration_formatted', 'N/A')}")
        
        print("\n" + "="*60)
        print("✅ The API is working perfectly!")
        print("You can now use this URL in the frontend at:")
        print("http://localhost:3000/dashboard")
    else:
        print(f"\n❌ Error: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\nMake sure:")
    print("1. Backend is running: python app.py")
    print("2. You have valid YouTube API key in backend/.env")

print("\n" + "="*60)
