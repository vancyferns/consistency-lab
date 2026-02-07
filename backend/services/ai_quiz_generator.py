from services.gemini_service import generate_json_content
import json

def generate_quiz(transcript: str, num_questions: int = 5, difficulty: str = 'Medium') -> dict:
    """
    Generate quiz questions from video transcript
    
    Args:
        transcript: Video transcript text
        num_questions: Number of questions to generate
        difficulty: Easy, Medium, or Hard
    
    Returns:
        Dictionary with questions array
    """
    prompt = f"""
Generate {num_questions} multiple-choice questions from this video transcript.

TRANSCRIPT:
{transcript[:4000]}

DIFFICULTY: {difficulty}

Requirements:
- Questions should test understanding, not just recall
- Each question has 1 correct answer and 3 plausible distractors
- Include brief explanation for the correct answer
- Mix of concept and application questions

Return JSON:
{{
  "questions": [
    {{
      "question": "Question text here?",
      "correct_answer": "The right answer",
      "wrong_answers": ["Wrong 1", "Wrong 2", "Wrong 3"],
      "explanation": "Why this is correct and what concept it tests"
    }}
  ]
}}
"""
    
    try:
        response = generate_json_content(prompt)
        quiz = json.loads(response)
        
        # Validate structure
        if 'questions' not in quiz:
            raise ValueError("Invalid quiz format")
        
        return quiz
        
    except Exception as e:
        print(f"Error generating quiz: {e}")
        return {
            "questions": [],
            "error": "Quiz generation failed"
        }

def generate_flashcards(transcript: str, num_cards: int = 10) -> dict:
    """
    Generate flashcards from video content
    
    Args:
        transcript: Video transcript text
        num_cards: Number of flashcards to generate
    
    Returns:
        Dictionary with flashcards array
    """
    prompt = f"""
Generate {num_cards} flashcards for key concepts from this content.

TRANSCRIPT:
{transcript[:3000]}

Return JSON:
{{
  "flashcards": [
    {{
      "front": "Concept or question",
      "back": "Definition or answer"
    }}
  ]
}}
"""
    
    try:
        response = generate_json_content(prompt)
        return json.loads(response)
    except Exception as e:
        print(f"Error generating flashcards: {e}")
        return {"flashcards": [], "error": str(e)}
