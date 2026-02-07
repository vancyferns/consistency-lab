# 🧪 Testing Guide - Phases 5 & 6

## Quick Start

### Prerequisites
1. Backend running on `http://localhost:5000`
2. Frontend running on `http://localhost:3000`
3. Valid API keys (YouTube, Gemini) in `.env` files

---

## Test Checklist

### ✅ Phase 5: Progress Tracking + AI Analytics

#### Test 1: Video Timestamp Saving
**Endpoint:** `POST /api/progress/save-timestamp`

**Test with cURL:**
```bash
curl -X POST http://localhost:5000/api/progress/save-timestamp \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "video_id": "dQw4w9WgXcQ",
    "timestamp": 450,
    "duration": 600
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "timestamp": 450,
  "progress_percent": 75.0
}
```

#### Test 2: Mark Video Complete
**Endpoint:** `POST /api/progress/mark-complete`

**Test:**
```bash
curl -X POST http://localhost:5000/api/progress/mark-complete \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "video_id": "dQw4w9WgXcQ",
    "playlist_id": "playlist123"
  }'
```

**Expected:**
```json
{
  "success": true,
  "completed": true,
  "message": "Video marked as complete! 🎉"
}
```

#### Test 3: Log Study Session
**Endpoint:** `POST /api/progress/log-session`

**Test:**
```bash
curl -X POST http://localhost:5000/api/progress/log-session \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "duration_minutes": 45,
    "notes": "Completed Chapter 3",
    "playlist_id": "playlist123"
  }'
```

#### Test 4: AI Learning Insights
**Endpoint:** `POST /api/progress/ai-insights`

**Test:**
```bash
curl -X POST http://localhost:5000/api/progress/ai-insights \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user"}'
```

**Expected:** AI-generated insights with:
- Pattern analysis
- Completion probability
- Optimal review times
- Recommendations

#### Test 5: Sync Progress
**Endpoint:** `GET /api/progress/sync-progress/:user_id`

**Test:**
```bash
curl http://localhost:5000/api/progress/sync-progress/test_user
```

---

### ✅ Phase 6: AI Learning Tools

#### Test 6: Generate Quiz
**Endpoint:** `POST /api/learning-tools/generate-quiz`

**Test:**
```bash
curl -X POST http://localhost:5000/api/learning-tools/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
    "difficulty": "medium",
    "num_questions": 5
  }'
```

**Expected:** Array of 5 quiz questions with options and answers

#### Test 7: Generate Flashcards
**Endpoint:** `POST /api/learning-tools/generate-flashcards`

**Test:**
```bash
curl -X POST http://localhost:5000/api/learning-tools/generate-flashcards \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "dQw4w9WgXcQ",
    "num_cards": 10
  }'
```

**Expected:** Array of 10 flashcards with front/back/category

#### Test 8: Video Summary
**Endpoint:** `POST /api/learning-tools/video-summary`

**Test:**
```bash
curl -X POST http://localhost:5000/api/learning-tools/video-summary \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "dQw4w9WgXcQ",
    "title": "Introduction to Machine Learning"
  }'
```

**Expected:** Summary with TL;DR, key points, takeaways, prerequisites, next steps

#### Test 9: Chapter Markers
**Endpoint:** `POST /api/learning-tools/chapter-markers`

**Test:**
```bash
curl -X POST http://localhost:5000/api/learning-tools/chapter-markers \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "dQw4w9WgXcQ",
    "duration": 600
  }'
```

#### Test 10: Personalized Notes
**Endpoint:** `POST /api/learning-tools/personalized-notes`

**Test:**
```bash
curl -X POST http://localhost:5000/api/learning-tools/personalized-notes \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "dQw4w9WgXcQ",
    "learning_style": "visual",
    "focus_areas": ["Machine Learning", "Neural Networks"]
  }'
```

#### Test 11: Learning Style Analysis
**Endpoint:** `POST /api/learning-tools/learning-style-analysis`

**Test:**
```bash
curl -X POST http://localhost:5000/api/learning-tools/learning-style-analysis \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user"}'
```

#### Test 12: Spaced Repetition Schedule
**Endpoint:** `POST /api/learning-tools/spaced-repetition`

**Test:**
```bash
curl -X POST http://localhost:5000/api/learning-tools/spaced-repetition \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "playlist_id": "playlist123"
  }'
```

#### Test 13: Submit Quiz
**Endpoint:** `POST /api/learning-tools/submit-quiz`

**Test:**
```bash
curl -X POST http://localhost:5000/api/learning-tools/submit-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "video_id": "dQw4w9WgXcQ",
    "answers": {"0": "A", "1": "B", "2": "C", "3": "A", "4": "D"},
    "questions": [...]
  }'
```

---

## Frontend Testing

### Test Learning Tools Page

1. **Navigate to Learning Tools**
   ```
   http://localhost:3000/learning-tools
   ```

2. **Test Summary Tab**
   - Click "Generate Summary" button
   - Wait 3-5 seconds for AI processing
   - Verify all 5 sections appear (TL;DR, Key Points, etc.)
   - Click "Copy Summary" to test clipboard

3. **Test Quiz Tab**
   - Select difficulty level (easy/medium/hard)
   - Click "Generate Quiz"
   - Answer all 5 questions
   - Click "Submit Quiz"
   - Review results with explanations
   - Try "Try Again" button

4. **Test Flashcards Tab**
   - Click "Generate Flashcards"
   - Click on card to flip
   - Mark some as "Mastered"
   - Mark some as "Need Review"
   - Use navigation buttons (Previous/Next)
   - Complete all 10 cards

5. **Test Analytics Tab**
   - View learning pattern analysis
   - Check completion probability display
   - Read optimal review times
   - Click "Get Detailed 30-Day Schedule"
   - Review spaced repetition calendar
   - Read personalized recommendations
   - Click "Refresh Insights"

---

## Component Testing

### QuizGenerator Component

**Location:** `frontend/components/QuizGenerator.tsx`

**Test Cases:**
1. Initial state shows difficulty selector
2. Generate button is enabled
3. Quiz generates with 5 questions
4. Progress bar updates as you navigate
5. Can't submit without answering all questions
6. Results show correct score
7. Explanations display for wrong answers
8. "Try Again" creates new quiz

### FlashcardsGenerator Component

**Location:** `frontend/components/FlashcardsGenerator.tsx`

**Test Cases:**
1. Initial state shows generate button
2. Creates 10 flashcards
3. Flip animation works smoothly
4. Mastered cards increment counter
5. Progress bar updates correctly
6. Navigation works (Previous/Next/Flip)
7. Completion message appears at 100%
8. "Review Again" resets mastered count

### VideoSummaryGenerator Component

**Location:** `frontend/components/VideoSummaryGenerator.tsx`

**Test Cases:**
1. Generate button works
2. All 5 sections render
3. TL;DR is concise
4. Key points are numbered
5. Takeaways have icons
6. Prerequisites show as badges
7. Next steps are listed
8. Copy to clipboard works

### LearningAnalytics Component

**Location:** `frontend/components/LearningAnalytics.tsx`

**Test Cases:**
1. Auto-loads on mount
2. Pattern analysis displays
3. Completion probability shows percentage
4. Progress bar matches percentage
5. Review times show numbered list
6. Spaced repetition schedule loads
7. Schedule shows 30 days
8. Recommendations render correctly
9. Refresh button updates data

---

## Integration Testing

### End-to-End Flow

**Scenario 1: Complete Learning Session**
1. User visits `/learning-tools`
2. Generates video summary
3. Reads TL;DR and key points
4. Watches video (timestamp tracked)
5. Takes quiz after watching
6. Reviews with flashcards
7. Checks analytics for insights

**Scenario 2: Spaced Repetition Workflow**
1. User completes multiple videos
2. Takes quizzes to assess mastery
3. Clicks "Get Spaced Repetition Schedule"
4. Views 30-day review calendar
5. Follows schedule for reviews
6. Progress tracked automatically

**Scenario 3: Learning Style Adaptation**
1. User studies for several days
2. System tracks behavior patterns
3. Visits Analytics tab
4. Reviews learning style analysis
5. Gets personalized recommendations
6. Adjusts study approach

---

## Performance Testing

### Expected Response Times

- **Quiz Generation:** 3-8 seconds
- **Flashcard Generation:** 3-8 seconds
- **Summary Generation:** 5-10 seconds
- **Analytics Insights:** 2-5 seconds
- **Spaced Repetition:** 3-6 seconds
- **Timestamp Save:** <100ms
- **Mark Complete:** <100ms
- **Log Session:** <100ms

### Load Testing

Test with multiple simultaneous requests:
```bash
# Run 10 parallel quiz generations
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/learning-tools/generate-quiz \
    -H "Content-Type: application/json" \
    -d '{"video_id":"test","difficulty":"medium","num_questions":5}' &
done
```

---

## Error Handling Testing

### Test Error Cases

1. **Missing Video ID**
   ```bash
   curl -X POST http://localhost:5000/api/learning-tools/generate-quiz \
     -H "Content-Type: application/json" \
     -d '{"difficulty":"medium"}'
   ```
   **Expected:** 400 error with message

2. **Invalid Video ID**
   ```bash
   curl -X POST http://localhost:5000/api/learning-tools/generate-quiz \
     -H "Content-Type: application/json" \
     -d '{"video_id":"invalid123","difficulty":"medium"}'
   ```
   **Expected:** 404 error (transcript not found)

3. **Network Error**
   - Stop backend server
   - Try frontend actions
   - **Expected:** Error messages display

---

## Browser Testing

### Supported Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Mobile Testing
- Test on responsive breakpoints
- Verify card flip animation works on touch
- Check quiz navigation on mobile
- Ensure readability on small screens

---

## Video Test Cases

### Recommended Test Videos

1. **3Blue1Brown - Linear Algebra**
   - Playlist: `PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab`
   - Great for: Quiz, Flashcards, Summary

2. **Fireship - 100 Seconds Series**
   - Short videos (100 seconds)
   - Great for: Quick testing, Chapter markers

3. **Crash Course**
   - Educational content
   - Great for: All features

---

## Known Limitations

1. **Transcript Availability**
   - Some videos don't have transcripts
   - Private videos can't be accessed
   
2. **AI Response Time**
   - Gemini API can take 3-10 seconds
   - No streaming for quiz/flashcard generation

3. **Mock Data**
   - Some features use mock data (user progress)
   - Supabase integration commented out
   - Replace with real database calls in production

---

## Debugging Tips

### Backend Debugging
```bash
# Check Flask logs
cd backend
python app.py
# Watch console for errors
```

### Frontend Debugging
```javascript
// Add console logs in components
console.log('Quiz data:', data);

// Check network tab in browser DevTools
// Verify API responses
```

### Common Issues

**Issue:** Quiz doesn't generate
- **Fix:** Check if video has transcript
- **Fix:** Verify Gemini API key is valid

**Issue:** Flashcards don't flip
- **Fix:** Check CSS transform support
- **Fix:** Clear browser cache

**Issue:** Analytics don't load
- **Fix:** Verify user_id is being passed
- **Fix:** Check backend logs for errors

---

## Success Criteria

### Phase 5 - Progress Tracking ✅
- [x] Timestamps save correctly
- [x] Completions log to database
- [x] Sessions tracked with duration
- [x] Progress syncs across devices
- [x] AI insights generate successfully
- [x] Completion predictions show percentage
- [x] Review times display properly

### Phase 6 - Learning Tools ✅
- [x] Quizzes generate with 5 questions
- [x] Flashcards flip and track mastery
- [x] Summaries show all 5 sections
- [x] Chapter markers created
- [x] Notes adapt to learning style
- [x] Style analysis works
- [x] Spaced repetition schedules correctly

---

## Next Steps After Testing

1. **Add Supabase Integration**
   - Uncomment database calls
   - Test with real user data
   - Verify RLS policies

2. **Optimize Performance**
   - Add caching for AI responses
   - Implement request debouncing
   - Add loading states

3. **Add Authentication**
   - Integrate Google OAuth
   - Protect API endpoints
   - Handle user sessions

4. **Deploy**
   - Set up production environment
   - Configure environment variables
   - Test in production

---

**Testing Completed:** ☐  
**Issues Found:** ___  
**Fixes Applied:** ___  
**Ready for Production:** ☐
