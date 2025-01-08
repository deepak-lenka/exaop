import requests
from datetime import datetime
from typing import Dict
from rich.console import Console
from config import Config

class ExaOpSearch:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.exa.ai"
        self.console = Console()

    def search_info(self, custom_query: str = None) -> Dict:
        """Search for information using Exa API"""
        if not self.api_key:
            return {
                "error": "Exa API key is not configured",
                "results": None
            }

        url = f"{self.base_url}/search"
        base_query = custom_query or "Search query"
        
        payload = {
            "query": base_query,
            "useAutoprompt": True,
            "type": "neural",
            "numResults": Config.MAX_RESULTS,
            "contents": {
                "text": {
                    "maxCharacters": 5000,
                    "includeHtmlTags": True
                },
                "images": {
                    "enabled": True,
                    "maxImages": 3,
                    "style": "article",
                    "extractFromHtml": True,
                    "includeOgImage": True
                },
                "summary": {
                    "query": f"Summarize information about {base_query}"
                },
                "highlights": {
                    "numSentences": 3,
                    "highlightsPerUrl": 5,
                    "query": f"Key information about {base_query}"
                },
                "livecrawl": "always",
                "livecrawlTimeout": 10000
            }
        }

        headers = {
            "x-api-key": self.api_key,
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            # Validate response structure
            if not isinstance(data, dict):
                self.console.print("[red]Error: Invalid response format from Exa API[/red]")
                return {"error": "Invalid response format", "results": None}
            
            if not data.get('results'):
                self.console.print("[yellow]Warning: No results found in response[/yellow]")
                return {"error": "No results found", "results": None}
            
            # Validate each result has required fields
            for result in data['results']:
                if not all(k in result for k in ['title', 'url']):
                    self.console.print("[yellow]Warning: Some results are missing required fields[/yellow]")
            
            return data
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Error making Exa API request: {str(e)}"
            self.console.print(f"[red]{error_msg}[/red]")
            if hasattr(e, 'response') and e.response:
                self.console.print(f"Response status: {e.response.status_code}")
                self.console.print(f"Response text: {e.response.text}")
            return {"error": error_msg, "results": None}
        except Exception as e:
            error_msg = f"Unexpected error with Exa API: {str(e)}"
            self.console.print(f"[red]{error_msg}[/red]")
            return {"error": error_msg, "results": None} 