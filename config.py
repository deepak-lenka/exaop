from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config:
    # API Keys
    EXA_API_KEY = os.getenv("EXA_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Model Configuration
    MODEL_NAME = os.getenv("MODEL_NAME", "gpt-3.5-turbo")
    TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))
    MAX_RESULTS = int(os.getenv("MAX_RESULTS", "20"))
    
    @staticmethod
    def validate():
        """Validate required environment variables"""
        errors = []
        
        if not Config.EXA_API_KEY:
            errors.append("EXA_API_KEY not found in environment variables")
        elif len(Config.EXA_API_KEY) < 10:  # Basic length check
            errors.append("EXA_API_KEY appears to be invalid")
            
        if not Config.OPENAI_API_KEY:
            errors.append("OPENAI_API_KEY not found in environment variables")
        elif not Config.OPENAI_API_KEY.startswith(('sk-', 'org-')):  # Basic format check
            errors.append("OPENAI_API_KEY appears to be invalid")
            
        if errors:
            raise ValueError("\n".join(errors))
            
        return True 