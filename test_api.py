import requests
import json

# Test the backend API
BASE_URL = "http://localhost:5000"

print("Testing Consistency Lab Backend API...")
print("="*60)

# Test 1: Health check
print("\n1. Testing Health Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   Error: {e}")

# Test 2: Root endpoint
print("\n2. Testing Root Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   Error: {e}")

# Test 3: Playlist analyze
print("\n3. Testing Playlist Analyze Endpoint...")
try:
    payload = {
        "playlist_id": "PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab"
    }
    response = requests.post(
        f"{BASE_URL}/api/playlist/analyze",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    print(f"   Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"   Playlist: {data.get('title', 'N/A')}")
        print(f"   Videos: {data.get('video_count', 0)}")
        print(f"   Duration: {data.get('total_duration_minutes', 0)} minutes")
    else:
        print(f"   Error: {response.text}")
except Exception as e:
    print(f"   Error: {e}")

print("\n" + "="*60)
print("API Testing Complete!")
