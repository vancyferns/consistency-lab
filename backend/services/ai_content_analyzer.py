from services.gemini_service import generate_json_content
import json

def generate_course_summary(transcript: str) -> dict:
    """
    Generate AI course summary from transcript
    
    Args:
        transcript: Video transcript text
    
    Returns:
        Dictionary with summary, topics, difficulty, etc.
    """
    prompt = f"""
Analyze this YouTube course transcript and provide a structured analysis.

TRANSCRIPT:
{transcript[:5000]}

Provide the following in JSON format:
{{
  "summary": "2-3 sentence course overview",
  "key_topics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "difficulty_level": "Beginner" | "Intermediate" | "Advanced",
  "prerequisites": ["prereq1", "prereq2"],
  "learning_objectives": ["objective1", "objective2", "objective3"]
}}

Focus on accuracy and clarity.
"""
    
    try:
        response = generate_json_content(prompt)
        return json.loads(response)
    except Exception as e:
        print(f"Error generating summary: {e}")
        return {
            "summary": "Summary generation failed",
            "key_topics": [],
            "difficulty_level": "Unknown",
            "prerequisites": [],
            "learning_objectives": []
        }

def analyze_difficulty(transcript: str) -> dict:
    """
    Analyze content difficulty level
    
    Args:
        transcript: Video transcript text
    
    Returns:
        Dictionary with difficulty analysis
    """
    prompt = f"""
Analyze the difficulty level of this educational content.

TRANSCRIPT:
{transcript[:3000]}

Consider:
- Technical jargon density
- Concept complexity
- Prerequisites required

Return JSON:
{{
  "difficulty_level": "Beginner" | "Intermediate" | "Advanced",
  "justification": "Brief explanation",
  "technical_score": 0-10,
  "prerequisites": ["list", "of", "prerequisites"]
}}
"""
    
    try:
        response = generate_json_content(prompt)
        return json.loads(response)
    except Exception as e:
        print(f"Error analyzing difficulty: {e}")
        return {
            "difficulty_level": "Unknown",
            "justification": "Analysis failed",
            "technical_score": 5,
            "prerequisites": []
        }
