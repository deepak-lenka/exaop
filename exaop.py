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
            self.console.print("[red]Error: Exa API key is not configured[/red]")
            return {
                "error": "Exa API key is not configured",
                "results": None
            }

        url = f"{self.base_url}/search"
        base_query = custom_query or "Search query"
        
        # Enhanced payload with Twitter/X support
        payload = {
            "query": base_query,
            "useAutoprompt": True,
            "type": "neural",
            "numResults": Config.MAX_RESULTS,
            "contents": {
                "text": {
                    "maxCharacters": 2000,
                    "includeHtmlTags": False
                },
                "images": {
                    "enabled": True,
                    "maxImages": 3,
                    "style": "article"
                },
                "media": {
                    "enabled": True,
                    "maxItems": 3,
                    "types": ["photo", "video"]
                },
                "summary": {
                    "query": f"Summarize information about {base_query}"
                },
                "highlights": {
                    "numSentences": 2,
                    "highlightsPerUrl": 3
                }
            },
            "source": {
                "twitter": {
                    "include": True,
                    "recent": True,
                    "includeMedia": True
                },
                "domains": [
                    "twitter.com",
                    "x.com",
                    "*.twitter.com",
                    "*.x.com"
                ]
            },
            "preferences": {
                "twitter": {
                    "includeReplies": True,
                    "includeRetweets": True,
                    "minLikes": 10,
                    "minRetweets": 5,
                    "includeMedia": True
                }
            },
            "livecrawl": "fallback",
            "livecrawlTimeout": 5000
        }

        headers = {
            "x-api-key": self.api_key,
            "Content-Type": "application/json"
        }

        try:
            self.console.print(f"[blue]Sending request for query: {base_query}[/blue]")
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            # Print response status for debugging
            self.console.print(f"[blue]Response status code: {response.status_code}[/blue]")
            
            response.raise_for_status()
            data = response.json()
            
            # Debug print
            self.console.print(f"[blue]Received response with {len(data.get('results', []))} results[/blue]")
            
            # Validate and process results
            if not isinstance(data, dict) or not data.get('results'):
                self.console.print("[yellow]Warning: No results found in response[/yellow]")
                return {"error": "No results found", "results": None}
            
            # Filter valid results
            valid_results = []
            for result in data['results']:
                if all(k in result for k in ['title', 'url']):
                    # Add source type indicator for Twitter/X
                    if 'twitter.com' in result['url'] or 'x.com' in result['url']:
                        result['source_type'] = 'twitter'
                        # Extract media from tweet
                        if 'tweet' in result:
                            tweet = result['tweet']
                            if 'media' in tweet:
                                result['media'] = tweet['media']
                            if 'photos' in tweet:
                                result['photos'] = tweet['photos']
                            if 'images' in tweet:
                                result['images'] = tweet['images']
                    valid_results.append(result)
                else:
                    self.console.print("[yellow]Skipping result with missing fields[/yellow]")
            
            if not valid_results:
                self.console.print("[yellow]Warning: No valid results after filtering[/yellow]")
                return {"error": "No valid results found", "results": None}
            
            data['results'] = valid_results
            self.console.print(f"[green]Successfully found {len(valid_results)} valid results[/green]")
            return data
            
        except requests.exceptions.Timeout:
            error_msg = "Request timed out. Please try again."
            self.console.print(f"[red]{error_msg}[/red]")
            return {"error": error_msg, "results": None}
        except requests.exceptions.RequestException as e:
            error_msg = f"Error making Exa API request: {str(e)}"
            self.console.print(f"[red]{error_msg}[/red]")
            if hasattr(e, 'response') and e.response:
                self.console.print(f"[red]Response status: {e.response.status_code}[/red]")
                self.console.print(f"[red]Response text: {e.response.text}[/red]")
            return {"error": error_msg, "results": None}
        except Exception as e:
            error_msg = f"Unexpected error with Exa API: {str(e)}"
            self.console.print(f"[red]{error_msg}[/red]")
            return {"error": error_msg, "results": None} 