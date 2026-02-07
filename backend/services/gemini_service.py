import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Initialize Gemini 2.5 Flash model
model = genai.GenerativeModel('gemini-2.5-flash')

def generate_content(prompt: str, temperature: float = 0.7) -> str:
    """
    Generate content using Gemini 2.5 Flash
    
    Args:
        prompt: The input prompt
        temperature: Controls randomness (0.0 to 1.0)
    
    Returns:
        Generated text response
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=temperature,
                max_output_tokens=2048
            )
        )
        return response.text
    except Exception as e:
        print(f"Error generating content: {e}")
        raise

def generate_json_content(prompt: str) -> str:
    """
    Generate JSON-formatted content
    
    Args:
        prompt: The input prompt
    
    Returns:
        JSON string response
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,  # Lower temperature for more consistent JSON
                response_mime_type="application/json"
            )
        )
        return response.text
    except Exception as e:
        print(f"Error generating JSON content: {e}")
        raise

def count_tokens(text: str) -> int:
    """
    Count tokens in text
    
    Args:
        text: Input text
    
    Returns:
        Token count
    """
    try:
        return model.count_tokens(text).total_tokens
    except Exception as e:
        print(f"Error counting tokens: {e}")
        return 0

def stream_content(prompt: str):
    """
    Stream content generation (for real-time chatbot responses)
    
    Args:
        prompt: The input prompt
    
    Yields:
        Text chunks as they're generated
    """
    try:
        response = model.generate_content(prompt, stream=True)
        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        print(f"Error streaming content: {e}")
        raise

# Alias for backward compatibility
def get_gemini_response(prompt: str, temperature: float = 0.7) -> str:
    """
    Alias for generate_content() for backward compatibility
    """
    return generate_content(prompt, temperature)
