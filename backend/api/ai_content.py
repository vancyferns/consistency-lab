from flask import Blueprint, request, jsonify
from services.ai_content_analyzer import generate_course_summary, analyze_difficulty
from services.ai_quiz_generator import generate_quiz
from services.transcript_service import get_video_transcript

bp = Blueprint('ai_content', __name__, url_prefix='/api/ai')

@bp.route('/summarize', methods=['POST'])
def summarize():
    """
    Generate AI course summary
    
    Request body:
        {
            "video_id": "xxx" or "transcript": "..."
        }
    
    Returns:
        {
            "summary": str,
            "key_topics": [...],
            "difficulty_level": str,
            "prerequisites": [...]
        }
    """
    try:
        data = request.get_json()
        
        # Get transcript
        if 'transcript' in data:
            transcript = data['transcript']
        elif 'video_id' in data:
            transcript = get_video_transcript(data['video_id'])
        else:
            return jsonify({'error': 'Provide video_id or transcript'}), 400
        
        if not transcript:
            return jsonify({'error': 'Could not get transcript'}), 404
        
        # Generate summary
        summary = generate_course_summary(transcript)
        
        return jsonify(summary), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/generate-quiz', methods=['POST'])
def generate_quiz_endpoint():
    """
    Generate quiz questions from video content
    
    Request body:
        {
            "video_id": "xxx",
            "num_questions": 5,
            "difficulty": "Medium"
        }
    
    Returns:
        {
            "questions": [
                {
                    "question": str,
                    "correct_answer": str,
                    "wrong_answers": [...],
                    "explanation": str
                }
            ]
        }
    """
    try:
        data = request.get_json()
        video_id = data.get('video_id')
        num_questions = data.get('num_questions', 5)
        difficulty = data.get('difficulty', 'Medium')
        
        # Get transcript
        transcript = get_video_transcript(video_id)
        if not transcript:
            return jsonify({'error': 'Transcript not available'}), 404
        
        # Generate quiz
        quiz = generate_quiz(transcript, num_questions, difficulty)
        
        return jsonify(quiz), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
