from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import io
from pypdf import PdfReader
from services.gemini_service import get_gemini_response, generate_json_content
import json
import re
import ast

bp = Blueprint('notebook', __name__, url_prefix='/api/notebook')

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'md', 'markdown'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/analyze', methods=['POST'])
def analyze_notebook():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed (PDF, TXT, MD only)'}), 400

        filename = secure_filename(file.filename)
        text_content = ""

        # Extract Text
        if filename.lower().endswith('.pdf'):
            try:
                reader = PdfReader(file) # file acts as stream
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        text_content += text + "\n"
            except Exception as e:
                return jsonify({'error': f'Error reading PDF: {str(e)}'}), 400
        else:
            # Assume text/markdown
            try:
                text_content = file.read().decode('utf-8')
            except UnicodeDecodeError:
                return jsonify({'error': 'File encoding not supported (try UTF-8)'}), 400

        if not text_content.strip():
            return jsonify({'error': 'Could not extract text from file'}), 400

        # Truncate for API limit if necessary (Gemini Flash handles ~1M tokens, but huge text slows down)
        # 100k chars is approx 25k tokens. Safe.
        truncated_text = text_content[:100000] 

        # Generate AI Summary & NotebookLM Features
        prompt = f"""
        Role: Expert Research Assistant (simulating Google NotebookLM).
        Analyze the following document content comprehensively.

        Document:
        {truncated_text}
        
        Task:
        1. Provide a detailed summary.
        2. Identify key topics.
        3. Assess difficulty level.
        4. Define learning objectives.
        5. Generate 3 suggested follow-up questions (like NotebookLM).
        6. Create a brief "Audio Overview" script: A dialogue between two hosts (Host A and Host B) discussing the most interesting parts of this document. Keep it engaging and under 300 words.
        
        Format Outcome strictly as JSON:
        {{
            "summary": "...",
            "key_topics": ["...", "..."],
            "difficulty_level": "...",
            "learning_objectives": ["...", "..."],
            "suggested_questions": ["...", "..."],
            "audio_overview_script": "HOST A: ... \\nHOST B: ..."
        }}
        """
        
        # Call Gemini using JSON mode for reliability
        response = generate_json_content(prompt)
        
        # Parse JSON
        # Robust JSON Parsing
        ai_data = None
        parsing_error = None
        
        # Candidate 1: The substring between the first { and last }
        start_index = response.find('{')
        end_index = response.rfind('}')
        if start_index != -1 and end_index != -1:
            candidates = [response[start_index:end_index+1]]
        else:
            candidates = []
            
        # Candidate 2: Aggressively cleaned markdown
        clean_md = response.replace('```json', '').replace('```', '').strip()
        if clean_md not in candidates:
            candidates.append(clean_md)
            
        # Candidate 3: Raw response
        if response not in candidates:
            candidates.append(response)

        for candidate in candidates:
            try:
                # Strategy A: Standard JSON
                ai_data = json.loads(candidate)
                break
            except json.JSONDecodeError:
                # Strategy B: Fix trailing commas (common LLM error)
                try:
                    fixed = re.sub(r',(\s*[}\]])', r'\1', candidate)
                    ai_data = json.loads(fixed)
                    break
                except:
                    pass
                
                # Strategy C: Python literal eval (handles 'None', 'True', single quotes)
                try:
                    ai_data = ast.literal_eval(candidate)
                    if isinstance(ai_data, dict):
                        break
                except:
                    pass
        
        if not ai_data:
            print(f"JSON FATAL ERROR. Raw snippet: {response[:200]}...")
            ai_data = {
                "summary": f"Could not parse AI response. Raw output starts with: {response[:200]}...",
                "key_topics": ["(Error parsing AI response)"],
                "difficulty_level": "Unknown",
                "learning_objectives": [],
                "suggested_questions": [],
                "audio_overview_script": ""
            }

        result = {
            "filename": filename,
            "text_len": len(text_content),
            "preview_text": text_content[:200] + "...",
            "ai_summary": ai_data
        }

        return jsonify(result)

    except Exception as e:
        print(f"Error processing document: {e}")
        return jsonify({'error': str(e)}), 500
