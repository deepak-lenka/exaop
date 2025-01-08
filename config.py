from dotenv import load_dotenv
import os
from rich.console import Console

console = Console()

# Load environment variables from .env file
load_dotenv()

class Config:
    # API Keys
    EXA_API_KEY = os.getenv("EXA_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Model Configuration
    MODEL_NAME = os.getenv("MODEL_NAME", "gpt-3.5-turbo")
    TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))
    MAX_RESULTS = int(os.getenv("MAX_RESULTS", "10"))  # Reduced from 20
    
    @staticmethod
    def validate():
        """Validate required environment variables"""
        console.print("[blue]Validating configuration...[/blue]")
        
        errors = []
        warnings = []
        
        # Check EXA API Key
        if not Config.EXA_API_KEY:
            errors.append("EXA_API_KEY not found in environment variables")
        else:
            console.print(f"[green]✓ EXA_API_KEY found (length: {len(Config.EXA_API_KEY)})[/green]")
            
        # Check OpenAI API Key
        if not Config.OPENAI_API_KEY:
            errors.append("OPENAI_API_KEY not found in environment variables")
        else:
            console.print(f"[green]✓ OPENAI_API_KEY found (length: {len(Config.OPENAI_API_KEY)})[/green]")
            
        # Check other settings
        if Config.MAX_RESULTS > 10:
            warnings.append("MAX_RESULTS is set high which may cause timeouts")
            
        # Print any warnings
        for warning in warnings:
            console.print(f"[yellow]Warning: {warning}[/yellow]")
            
        # Handle errors
        if errors:
            error_msg = "\n".join(errors)
            console.print(f"[red]Configuration errors found:\n{error_msg}[/red]")
            raise ValueError(error_msg)
            
        console.print("[green]Configuration validation successful![/green]")
        return True 