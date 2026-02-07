# 🚀 Quick Start - Get Your API Keys

## Step-by-Step Setup (10 minutes)

### 1. YouTube API Key (2 minutes)
```
1. Visit: https://console.cloud.google.com/
2. Create new project: "Consistency Lab"
3. Enable: YouTube Data API v3
4. Create Credentials → API Key
5. Copy and paste in backend/.env
```

### 2. Gemini AI Key (1 minute)
```
1. Visit: https://aistudio.google.com/app/apikey
2. Click: Create API Key
3. Select your project
4. Copy and paste in backend/.env
```

### 3. Supabase Setup (5 minutes)
```
1. Visit: https://supabase.com/
2. Create new project: "Consistency Lab"
3. Wait for setup (2-3 minutes)
4. Go to Settings → API
5. Copy:
   - Project URL → both .env files
   - anon key → frontend/.env.local
   - service_role key → backend/.env
6. SQL Editor → Run schema.sql
```

### 4. Generate Flask Secret (30 seconds)
```bash
python -c "import secrets; print(secrets.token_hex(32))"
# Copy output to backend/.env
```

---

## 📝 Quick Reference

| What | Where to Get | Where to Put |
|------|-------------|--------------|
| YouTube Key | console.cloud.google.com | backend/.env |
| Gemini Key | aistudio.google.com | backend/.env |
| Supabase URL | supabase.com → Settings | Both .env files |
| Supabase Anon | supabase.com → Settings | frontend/.env.local |
| Supabase Service | supabase.com → Settings | backend/.env |
| Flask Secret | `python -c "import secrets..."` | backend/.env |

---

## ✅ Verification Commands

```bash
# Test all APIs at once
cd backend
python app.py  # Should start without errors

# In another terminal
cd frontend
npm run dev  # Should start on localhost:3000
```

---

## 🎯 Files You Need to Edit

1. **backend/.env** - Add 5 values
2. **frontend/.env.local** - Add 3 values

That's it! See `API_KEYS_SETUP.md` for detailed instructions.

---

## 🆘 Common Issues

**Error: Missing API key**
→ Check if you copied the key correctly (no spaces)

**Error: 403 Forbidden**
→ Enable the API in Google Cloud Console

**Error: CORS issue**
→ Make sure backend is running on port 5000

---

**Total Setup Time:** ~10 minutes  
**Total Cost:** $0 (all free tiers!)  
**Difficulty:** Easy 😊
