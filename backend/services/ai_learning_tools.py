"""
AI Learning Tools Service
Provides quiz generation, flashcards, summaries, and personalized learning features
"""

from services.gemini_service import get_gemini_response
import json

def generate_quiz_from_transcript(transcript, difficulty='medium', num_questions=5):
    """
    Generate quiz questions from video transcript
    
    Args:
        transcript (str): Video transcript text
        difficulty (str): 'easy', 'medium', or 'hard'
        num_questions (int): Number of questions to generate
    
    Returns:
        list: Quiz questions with options and answers
    """
    prompt = f"""
    Based on this video transcript, generate {num_questions} {difficulty} difficulty multiple-choice quiz questions.
    
    Transcript:
    {transcript[:3000]}...
    
    For each question provide:
    1. Question text
    2. Four options (A, B, C, D)
    3. Correct answer
    4. Explanation (2-3 sentences why this is correct)
    
    Format as JSON array:
    [
        {{
            "question": "...",
            "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
            "correct_answer": "A",
            "explanation": "..."
        }}
    ]
    
    Focus on key concepts and practical understanding, not trivial details.
    """
    
    response = get_gemini_response(prompt)
    
    try:
        questions = json.loads(response)
        return questions
    except:
        # Fallback if JSON parsing fails
        return [{
            'question': 'What is the main topic covered in this video?',
            'options': {
                'A': 'Option 1',
                'B': 'Option 2',
                'C': 'Option 3',
                'D': 'Option 4'
            },
            'correct_answer': 'A',
            'explanation': 'Based on the video content.'
        }]

def generate_flashcards(transcript, num_cards=10):
    """
    Generate flashcards from video content
    
    Args:
        transcript (str): Video transcript
        num_cards (int): Number of flashcards to create
    
    Returns:
        list: Flashcards with front/back content
    """
    prompt = f"""
    Create {num_cards} flashcards from this educational content.
    
    Content:
    {transcript[:3000]}...
    
    Each flashcard should have:
    - Front: A concise question or term
    - Back: Clear, memorable answer or definition (2-3 sentences max)
    
    Focus on key concepts, definitions, formulas, and important facts.
    
    Format as JSON:
    [
        {{
            "front": "What is...?",
            "back": "It is...",
            "category": "concept/definition/formula"
        }}
    ]
    """
    
    response = get_gemini_response(prompt)
    
    try:
        flashcards = json.loads(response)
        return flashcards
    except:
        return [{
            'front': 'Key Concept',
            'back': 'Important information from the video',
            'category': 'concept'
        }]

def generate_video_summary(transcript, title):
    """
    Generate concise video summary
    
    Args:
        transcript (str): Full video transcript
        title (str): Video title
    
    Returns:
        dict: Summary with different sections
    """
    prompt = f"""
    Create a comprehensive summary of this educational video.
    
    Title: {title}
    
    Transcript:
    {transcript[:4000]}...
    
    Provide:
    1. TL;DR (2-3 sentences)
    2. Key Points (5-7 bullet points)
    3. Main Takeaways (3 actionable insights)
    4. Prerequisites (what you should know before watching)
    5. Next Steps (what to learn after this)
    
    Format as JSON with keys: tldr, key_points, takeaways, prerequisites, next_steps
    """
    
    response = get_gemini_response(prompt)
    
    try:
        summary = json.loads(response)
    except:
        summary = {
            'tldr': 'This video covers important concepts.',
            'key_points': ['Point 1', 'Point 2', 'Point 3'],
            'takeaways': ['Takeaway 1', 'Takeaway 2'],
            'prerequisites': ['Basic understanding'],
            'next_steps': ['Continue learning']
        }
    
    return summary

def generate_chapter_recommendations(transcript, duration_seconds):
    """
    Generate chapter markers and timestamp recommendations
    
    Args:
        transcript (str): Video transcript with timestamps
        duration_seconds (int): Total video duration
    
    Returns:
        list: Chapter markers with timestamps and titles
    """
    prompt = f"""
    Analyze this video transcript and create chapter markers.
    
    Duration: {duration_seconds} seconds ({duration_seconds//60} minutes)
    
    Transcript:
    {transcript[:4000]}...
    
    Identify 5-8 natural chapter breaks and provide:
    1. Timestamp (in seconds)
    2. Chapter title (5-8 words)
    3. Brief description (1 sentence)
    
    Format as JSON:
    [
        {{
            "timestamp": 0,
            "title": "Introduction",
            "description": "Overview of topics covered"
        }}
    ]
    """
    
    response = get_gemini_response(prompt)
    
    try:
        chapters = json.loads(response)
    except:
        # Create basic chapters
        chapters = [
            {'timestamp': 0, 'title': 'Introduction', 'description': 'Video introduction'},
            {'timestamp': duration_seconds // 2, 'title': 'Main Content', 'description': 'Core concepts'},
            {'timestamp': duration_seconds - 120, 'title': 'Conclusion', 'description': 'Summary and next steps'}
        ]
    
    return chapters

def generate_personalized_notes(transcript, user_learning_style='visual', focus_areas=None):
    """
    Generate personalized study notes based on learning style
    
    Args:
        transcript (str): Video content
        user_learning_style (str): 'visual', 'auditory', 'reading', or 'kinesthetic'
        focus_areas (list): Specific topics to emphasize
    
    Returns:
        dict: Personalized notes
    """
    focus_text = ', '.join(focus_areas) if focus_areas else 'all topics'
    
    prompt = f"""
    Create personalized study notes for a {user_learning_style} learner.
    
    Content:
    {transcript[:3000]}...
    
    Focus on: {focus_text}
    
    For a {user_learning_style} learner, provide:
    1. Notes formatted for their learning style
       - Visual: Include diagram suggestions, mind map structure
       - Auditory: Include mnemonics, rhymes, discussion points
       - Reading/Writing: Detailed written notes, summaries
       - Kinesthetic: Hands-on activities, practice exercises
    
    2. Key Concepts (with explanations)
    3. Practice Suggestions (3-5 activities)
    4. Memory Aids (specific to learning style)
    
    Format as JSON with keys: notes, concepts, practice_suggestions, memory_aids
    """
    
    response = get_gemini_response(prompt)
    
    try:
        notes = json.loads(response)
    except:
        notes = {
            'notes': 'Personalized notes based on video content',
            'concepts': ['Concept 1', 'Concept 2'],
            'practice_suggestions': ['Practice activity 1', 'Practice activity 2'],
            'memory_aids': ['Memory aid 1', 'Memory aid 2']
        }
    
    return notes

def adapt_learning_style(user_progress_data):
    """
    Analyze user behavior and recommend learning style adaptations
    
    Args:
        user_progress_data (dict): User's learning history and patterns
    
    Returns:
        dict: Learning style recommendations
    """
    prompt = f"""
    Analyze this learner's behavior and recommend learning style adaptations.
    
    User Data:
    - Videos completed: {user_progress_data.get('videos_completed', 0)}
    - Average completion rate: {user_progress_data.get('completion_rate', 0)}%
    - Quiz scores: {user_progress_data.get('avg_quiz_score', 0)}%
    - Preferred session length: {user_progress_data.get('avg_session_minutes', 0)} min
    - Drop-off points: {user_progress_data.get('common_dropoff', 'middle of videos')}
    
    Based on this data, provide:
    1. Detected learning style (visual/auditory/reading/kinesthetic)
    2. Confidence level (0-100%)
    3. Strengths (what they're good at)
    4. Recommended adjustments (3-5 specific changes)
    5. Optimal content format (video length, difficulty, pace)
    
    Format as JSON with keys: learning_style, confidence, strengths, adjustments, optimal_format
    """
    
    response = get_gemini_response(prompt)
    
    try:
        recommendations = json.loads(response)
    except:
        recommendations = {
            'learning_style': 'visual',
            'confidence': 75,
            'strengths': ['Consistent practice', 'Good retention'],
            'adjustments': ['Break videos into smaller chunks', 'Add more visual aids'],
            'optimal_format': 'Short videos (15-20 min) with clear visuals'
        }
    
    return recommendations

def generate_spaced_repetition_schedule(topics, mastery_levels):
    """
    Create spaced repetition schedule for topics
    
    Args:
        topics (list): List of topics to review
        mastery_levels (dict): Topic -> mastery level (0-100)
    
    Returns:
        dict: Review schedule
    """
    prompt = f"""
    Create a spaced repetition schedule for these topics.
    
    Topics and Current Mastery:
    {json.dumps(mastery_levels, indent=2)}
    
    Using proven spaced repetition principles:
    - Topics with lower mastery need more frequent review
    - Schedule reviews at: 1 day, 3 days, 7 days, 14 days, 30 days
    - High mastery (80%+): Review less frequently
    - Low mastery (<50%): Review more frequently
    
    Provide a review schedule for the next 30 days.
    
    Format as JSON:
    {{
        "schedule": [
            {{"day": 1, "topics": ["topic1", "topic2"], "reason": "Initial review"}},
        ],
        "study_load": {{"light_days": [], "heavy_days": []}},
        "estimated_time_per_day": {{}}
    }}
    """
    
    response = get_gemini_response(prompt)
    
    try:
        schedule = json.loads(response)
    except:
        schedule = {
            'schedule': [
                {'day': 1, 'topics': topics[:2], 'reason': 'Initial review'},
                {'day': 3, 'topics': topics[:3], 'reason': 'First spaced review'},
                {'day': 7, 'topics': topics, 'reason': 'Weekly review'}
            ],
            'study_load': {'light_days': [2, 4, 5], 'heavy_days': [1, 3, 7]},
            'estimated_time_per_day': {'1': '30 min', '3': '45 min', '7': '60 min'}
        }
    
    return schedule
