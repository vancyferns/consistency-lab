from flask import Blueprint, request, jsonify
from services.ai_learning_tools import (
    generate_quiz_from_transcript,
    generate_flashcards,
    generate_video_summary,
    generate_chapter_recommendations,
    generate_personalized_notes,
    adapt_learning_style,
    generate_spaced_repetition_schedule
)
from services.transcript_service import get_video_transcript
import json

bp = Blueprint('learning_tools', __name__, url_prefix='/api/learning-tools')

@bp.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    """Generate quiz from video content"""
    try:
        data = request.json
        video_id = data.get('video_id')
        difficulty = data.get('difficulty', 'medium')
        num_questions = data.get('num_questions', 5)
        
        if not video_id:
            return jsonify({'error': 'video_id is required'}), 400
        
        # Get video transcript
        transcript = get_video_transcript(video_id)
        
        if not transcript:
            return jsonify({'error': 'Could not fetch transcript'}), 404
        
        # Generate quiz
        questions = generate_quiz_from_transcript(
            transcript,
            difficulty=difficulty,
            num_questions=num_questions
        )
        
        # TODO: Save quiz to database
        # supabase.table('ai_quiz_questions').insert({
        #     'video_id': video_id,
        #     'questions': questions,
        #     'difficulty': difficulty
        # }).execute()
        
        return jsonify({
            'success': True,
            'quiz': questions,
            'total_questions': len(questions)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/generate-flashcards', methods=['POST'])
def generate_flashcards_endpoint():
    """Generate flashcards from video content"""
    try:
        data = request.json
        video_id = data.get('video_id')
        num_cards = data.get('num_cards', 10)
        
        if not video_id:
            return jsonify({'error': 'video_id is required'}), 400
        
        # Get transcript
        transcript = get_video_transcript(video_id)
        
        if not transcript:
            return jsonify({'error': 'Could not fetch transcript'}), 404
        
        # Generate flashcards
        flashcards = generate_flashcards(transcript, num_cards=num_cards)
        
        return jsonify({
            'success': True,
            'flashcards': flashcards,
            'total_cards': len(flashcards)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/video-summary', methods=['POST'])
def get_video_summary():
    """Generate comprehensive video summary"""
    try:
        data = request.json
        video_id = data.get('video_id')
        title = data.get('title', 'Educational Video')
        
        if not video_id:
            return jsonify({'error': 'video_id is required'}), 400
        
        # Get transcript
        transcript = get_video_transcript(video_id)
        
        if not transcript:
            return jsonify({'error': 'Could not fetch transcript'}), 404
        
        # Generate summary
        summary = generate_video_summary(transcript, title)
        
        return jsonify({
            'success': True,
            'summary': summary
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/chapter-markers', methods=['POST'])
def get_chapter_markers():
    """Generate chapter markers and timestamps"""
    try:
        data = request.json
        video_id = data.get('video_id')
        duration = data.get('duration', 0)
        
        if not video_id:
            return jsonify({'error': 'video_id is required'}), 400
        
        # Get transcript
        transcript = get_video_transcript(video_id)
        
        if not transcript:
            return jsonify({'error': 'Could not fetch transcript'}), 404
        
        # Generate chapters
        chapters = generate_chapter_recommendations(transcript, duration)
        
        return jsonify({
            'success': True,
            'chapters': chapters,
            'total_chapters': len(chapters)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/personalized-notes', methods=['POST'])
def get_personalized_notes():
    """Generate personalized study notes"""
    try:
        data = request.json
        video_id = data.get('video_id')
        learning_style = data.get('learning_style', 'visual')
        focus_areas = data.get('focus_areas', [])
        
        if not video_id:
            return jsonify({'error': 'video_id is required'}), 400
        
        # Get transcript
        transcript = get_video_transcript(video_id)
        
        if not transcript:
            return jsonify({'error': 'Could not fetch transcript'}), 404
        
        # Generate notes
        notes = generate_personalized_notes(
            transcript,
            user_learning_style=learning_style,
            focus_areas=focus_areas
        )
        
        return jsonify({
            'success': True,
            'notes': notes,
            'learning_style': learning_style
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/learning-style-analysis', methods=['POST'])
def analyze_learning_style():
    """Analyze user behavior and recommend learning adaptations"""
    try:
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # TODO: Fetch real user progress data from Supabase
        # progress_data = supabase.table('video_progress').select('*').eq('user_id', user_id).execute()
        # quiz_data = supabase.table('quiz_attempts').select('*').eq('user_id', user_id).execute()
        
        # Mock data for now
        user_progress_data = {
            'videos_completed': 25,
            'completion_rate': 85,
            'avg_quiz_score': 78,
            'avg_session_minutes': 35,
            'common_dropoff': 'middle of videos'
        }
        
        # Get AI recommendations
        recommendations = adapt_learning_style(user_progress_data)
        
        return jsonify({
            'success': True,
            'analysis': recommendations
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/spaced-repetition', methods=['POST'])
def get_spaced_repetition_schedule():
    """Generate spaced repetition review schedule"""
    try:
        data = request.json
        user_id = data.get('user_id')
        playlist_id = data.get('playlist_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # TODO: Fetch topics and mastery levels from database
        # topics_data = supabase.table('user_topic_mastery').select('*')...
        
        # Mock data
        topics = ['Linear Algebra Basics', 'Calculus Introduction', 'Python Functions', 'Data Structures']
        mastery_levels = {
            'Linear Algebra Basics': 45,
            'Calculus Introduction': 70,
            'Python Functions': 85,
            'Data Structures': 60
        }
        
        # Generate schedule
        schedule = generate_spaced_repetition_schedule(topics, mastery_levels)
        
        return jsonify({
            'success': True,
            'schedule': schedule
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/submit-quiz', methods=['POST'])
def submit_quiz_attempt():
    """Submit quiz answers and get results"""
    try:
        data = request.json
        user_id = data.get('user_id')
        video_id = data.get('video_id')
        answers = data.get('answers', {})
        quiz_questions = data.get('questions', [])
        
        if not all([user_id, video_id, answers]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Calculate score
        correct = 0
        total = len(quiz_questions)
        results = []
        
        for i, question in enumerate(quiz_questions):
            user_answer = answers.get(str(i))
            correct_answer = question.get('correct_answer')
            is_correct = user_answer == correct_answer
            
            if is_correct:
                correct += 1
            
            results.append({
                'question_index': i,
                'user_answer': user_answer,
                'correct_answer': correct_answer,
                'is_correct': is_correct,
                'explanation': question.get('explanation', '')
            })
        
        score_percent = (correct / total * 100) if total > 0 else 0
        
        # TODO: Save to database
        # supabase.table('quiz_attempts').insert({
        #     'user_id': user_id,
        #     'video_id': video_id,
        #     'score': score_percent,
        #     'answers': answers,
        #     'timestamp': datetime.now().isoformat()
        # }).execute()
        
        return jsonify({
            'success': True,
            'score': round(score_percent, 1),
            'correct': correct,
            'total': total,
            'results': results,
            'passed': score_percent >= 70
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
