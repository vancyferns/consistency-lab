# Gemini 2.5 Flash - Quick Reference

## Setup

### 1. Get API Key
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create new API key
3. Add to `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### 2. Install Library
```bash
pip install google-generativeai
```

### 3. Initialize Client
```python
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.5-flash')
```

---

## Common Use Cases

### Course Summary Generation
```python
def generate_course_summary(transcript: str) -> dict:
    prompt = f"""
    Analyze this YouTube course transcript and provide:
    1. Brief summary (2-3 sentences)
    2. Key topics (5-7 topics)
    3. Difficulty level (Beginner/Intermediate/Advanced)
    
    TRANSCRIPT:
    {transcript}
    
    Return as JSON.
    """
    
    response = model.generate_content(prompt)
    return json.loads(response.text)
```

### Quiz Generation
```python
def generate_quiz(video_title: str, transcript: str, num_questions: int = 5) -> list:
    prompt = f"""
    Generate {num_questions} multiple-choice questions from this video.
    
    VIDEO: {video_title}
    TRANSCRIPT: {transcript}
    
    Each question needs:
    - question text
    - correct_answer
    - 3 wrong_answers (distractors)
    - explanation
    
    Return as JSON array.
    """
    
    response = model.generate_content(prompt)
    return json.loads(response.text)
```

### Conversational Assistant (RAG)
```python
def chat_with_context(user_question: str, course_context: str, chat_history: list) -> str:
    system_prompt = f"""
    You are a learning assistant for this course.
    
    COURSE CONTEXT:
    {course_context}
    
    Answer using ONLY the context provided.
    """
    
    # Build conversation history
    messages = [{"role": "user", "parts": [system_prompt]}]
    for msg in chat_history:
        messages.append({"role": msg["role"], "parts": [msg["content"]]})
    messages.append({"role": "user", "parts": [user_question]})
    
    chat = model.start_chat(history=messages[:-1])
    response = chat.send_message(user_question)
    return response.text
```

### Difficulty Analysis
```python
def analyze_difficulty(transcript: str) -> dict:
    prompt = f"""
    Analyze the difficulty level of this content.
    
    Consider:
    - Technical jargon density
    - Concept complexity
    - Prerequisites needed
    
    TRANSCRIPT: {transcript}
    
    Return JSON with:
    - difficulty_level: "Beginner" | "Intermediate" | "Advanced"
    - justification: string
    - prerequisites: list
    """
    
    response = model.generate_content(prompt)
    return json.loads(response.text)
```

---

## Best Practices

### 1. Token Usage Optimization
```python
# Count tokens before sending
token_count = model.count_tokens(prompt).total_tokens
print(f"Prompt uses {token_count} tokens")

# Stay within context window (1M tokens)
if token_count > 900000:  # Leave headroom
    prompt = chunk_and_reduce(prompt)
```

### 2. Error Handling
```python
from google.api_core import retry
import time

@retry.Retry(predicate=retry.if_exception_type(Exception))
def call_gemini_with_retry(prompt: str):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error: {e}")
        time.sleep(2)  # Rate limit cooldown
        raise
```

### 3. Streaming Responses (For Chatbot)
```python
def stream_chat_response(user_question: str):
    response = model.generate_content(user_question, stream=True)
    
    for chunk in response:
        if chunk.text:
            yield chunk.text  # Stream to frontend
```

### 4. JSON Mode
```python
# Ensure valid JSON responses
response = model.generate_content(
    prompt,
    generation_config=genai.GenerationConfig(
        response_mime_type="application/json"
    )
)
```

---

## Rate Limits (Free Tier)

- **15 requests per minute (RPM)**
- **1,500 requests per day (RPD)**
- **4 million tokens per minute**

### Rate Limit Handling
```python
import time
from collections import deque
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, rpm=15):
        self.rpm = rpm
        self.requests = deque()
    
    def wait_if_needed(self):
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)
        
        # Remove old requests
        while self.requests and self.requests[0] < minute_ago:
            self.requests.popleft()
        
        # Check if at limit
        if len(self.requests) >= self.rpm:
            sleep_time = (self.requests[0] - minute_ago).total_seconds()
            time.sleep(sleep_time + 1)
        
        self.requests.append(now)

# Usage
limiter = RateLimiter(rpm=15)

def safe_api_call(prompt):
    limiter.wait_if_needed()
    return model.generate_content(prompt)
```

---

## Cost Estimation

**Gemini 2.5 Flash (Free Tier)**
- Input: Free up to 1,500 RPD
- Output: Free up to 1,500 RPD

**Typical Usage per User per Month**
- 5 course summaries: 5 API calls
- 50 quiz questions: ~10 API calls (5 questions per call)
- 100 chatbot messages: 100 API calls
- **Total: ~115 calls/month** → Easily within free tier

---

## Troubleshooting

### "Resource exhausted" Error
- You've hit the rate limit
- Wait 60 seconds and retry
- Implement rate limiter (see above)

### "Invalid JSON" Response
- Add explicit JSON formatting instructions
- Use `response_mime_type="application/json"`
- Add example JSON in prompt

### Poor Quality Responses
- Add more context in prompt
- Use few-shot examples
- Be more specific in instructions
- Break complex tasks into steps
