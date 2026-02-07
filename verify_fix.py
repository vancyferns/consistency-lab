import requests
import time
import sys

# Configuration
BASE_URL = "http://localhost:5000"
VIDEO_ID = "_uQrJ0TkZlc" # Python Tutorial for Beginners (Mosh)

print("🧪 FINAL SYSTEM TEST")
print("==================")

# 1. Test Backend Connection
print("\n1. Checking Backend Connection...")
try:
    r = requests.get(f"{BASE_URL}/health", timeout=2)
    if r.status_code == 200:
        print("✅ Backend is ONLINE")
    else:
        print(f"❌ Backend returned status {r.status_code}")
        sys.exit(1)
except:
    print("❌ Backend is OFFLINE. Please run 'python app.py' in backend folder.")
    sys.exit(1)

# 2. Test Transcript Fetching (Direct)
print("\n2. Testing Transcript Service...")
# We can't test service directly via API easily without hitting the AI endpoint,
# but we can check if the transcript endpoint works
try:
    r = requests.get(f"{BASE_URL}/api/playlist/video/{VIDEO_ID}/transcript")
    if r.status_code == 200:
        print("✅ Transcript Fetching WORKS")
        print(f"   Length: {len(r.json().get('transcript', ''))} chars")
    else:
        print(f"❌ Transcript Fetching FAILED: {r.status_code}")
        print(f"   Error: {r.text}")
        print("   -> Did you restart the backend after library fix?")
except Exception as e:
    print(f"❌ Error: {e}")

# 3. Test AI Summary (The feature that was failing)
print("\n3. Testing AI Course Summary...")
print("   (This uses Gemini API, may take 5-10 seconds...)")
try:
    start = time.time()
    r = requests.post(
        f"{BASE_URL}/api/ai/summarize", 
        json={"video_id": VIDEO_ID},
        timeout=60
    )
    elapsed = time.time() - start
    
    if r.status_code == 200:
        data = r.json()
        print(f"✅ AI Summary Generated in {elapsed:.1f}s!")
        print("="*40)
        print(f"📝 Summary: {data.get('summary', '')[:100]}...")
        print("="*40)
    else:
        print(f"❌ AI Summary FAILED: {r.status_code}")
        print(f"   Error: {r.text}")

except Exception as e:
    print(f"❌ Error: {e}")

print("\nDONE.")
