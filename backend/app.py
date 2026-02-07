from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
frontend_url = os.getenv('FRONTEND_URL')
if frontend_url:
    CORS(app, origins=[frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"])
else:
    CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Import routes
from api import playlist, schedule, ai_assistant, ai_content, progress, learning_tools, notebook

# Register blueprints
app.register_blueprint(playlist.bp)
app.register_blueprint(schedule.bp)
app.register_blueprint(ai_assistant.bp)
app.register_blueprint(ai_content.bp)
app.register_blueprint(progress.bp)
app.register_blueprint(learning_tools.bp)
app.register_blueprint(notebook.bp)

@app.route('/')
def index():
    return {
        'message': 'Consistency Lab API',
        'version': '1.0.0',
        'endpoints': {
            'playlist': '/api/playlist',
            'schedule': '/api/schedule',
            'ai': '/api/ai'
        }
    }

@app.route('/health')
def health():
    return {'status': 'healthy'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
