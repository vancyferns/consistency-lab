from flask import Blueprint, request, jsonify, Response
from services.gemini_service import stream_content
from services.transcript_service import get_video_transcript
import json

bp = Blueprint('ai_assistant', __name__, url_prefix='/api/ai')

@bp.route('/chat', methods=['POST'])
def chat():
    """
    Conversational AI assistant with RAG
    
    Request body:
        {
            "message": "Explain this concept",
            "course_context": "Course title and description",
            "video_id": "xxx" (optional, for RAG)
        }
    
    Returns:
        {
            "response": "AI generated response"
        }
    """
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        course_context = data.get('course_context', '')
        video_id = data.get('video_id')
        
        # Build context
        context = f"You are a learning assistant for this course.\n\nCOURSE: {course_context}\n\n"
        
        # RAG: Retrieve transcript if video_id provided
        if video_id:
            transcript = get_video_transcript(video_id)
            if transcript:
                context += f"RELEVANT CONTENT:\n{transcript[:3000]}\n\n"
        
        context += "Answer the user's question using the provided context. Be concise and helpful."
        
        # Generate response
        from services.gemini_service import generate_content
        prompt = f"{context}\n\nUSER QUESTION: {user_message}\n\nASSISTANT:"
        response = generate_content(prompt)
        
        return jsonify({
            'response': response,
            'context_used': bool(video_id and transcript)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/chat/stream', methods=['POST'])
def chat_stream():
    """Streaming chat endpoint for real-time responses"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        course_context = data.get('course_context', '')
        
        context = f"You are a learning assistant for: {course_context}\n\nUSER: {user_message}\n\nASSISTANT:"
        
        def generate():
            for chunk in stream_content(context):
                yield f"data: {json.dumps({'text': chunk})}\n\n"
        
        return Response(generate(), mimetype='text/event-stream')
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
