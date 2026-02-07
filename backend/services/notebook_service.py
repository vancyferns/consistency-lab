import os
import io
from pypdf import PdfReader

def extract_text_from_file(file, filename):
    """
    Extract text from an uploaded file (PDF or Text)
    """
    ext = filename.split('.')[-1].lower()
    
    if ext == 'pdf':
        try:
            reader = PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return None
            
    elif ext in ['txt', 'md', 'markdown']:
        try:
            # Try UTF-8 decoding
            content = file.read()
            if isinstance(content, bytes):
                return content.decode('utf-8')
            return content
        except Exception as e:
            print(f"Error reading text file: {e}")
            return None
            
    else:
        # Unsupported format
        return None
