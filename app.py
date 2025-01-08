import streamlit as st
from exaop import ExaOpSearch
from config import Config
from rich.console import Console
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

st.set_page_config(
    page_title="ExaOp Search",
    page_icon="🔍",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Apply custom CSS
st.markdown("""
<style>
    .stApp {
        background: linear-gradient(to bottom, #1a1a1a, #2d2d2d) !important;
    }
    
    .title-container {
        text-align: center;
        background: rgba(0, 0, 0, 0.2);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .title-text {
        font-size: 2.5rem !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        margin-bottom: 0.5rem !important;
    }
    
    .subtitle {
        color: #b0b0b0;
        font-size: 1.1rem;
    }
    
    a {
        color: #00A6ED !important;
        text-decoration: underline;
    }
    
    a:hover {
        opacity: 0.8;
    }
    
    img {
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .stSpinner > div {
        border-color: #ffffff transparent transparent !important;
    }
    
    /* Chat input container */
    .stChatFloatingInputContainer, section[data-testid="stChatInput"] {
        position: fixed !important;
        bottom: 0 !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        max-width: 640px !important;
        width: 90% !important;
        padding: 1rem !important;
        background: transparent !important;
        border: none !important;
        z-index: 999 !important;
    }
    
    /* Chat input box */
    .stChatInput {
        background-color: #2b2c2e !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
        padding: 0.75rem 1rem !important;
        color: white !important;
        width: 100% !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }
    
    /* Add padding to main container to prevent overlap */
    .main .block-container {
        padding-bottom: 120px !important;
    }
</style>
""", unsafe_allow_html=True)

class ExaOpChatbot:
    def __init__(self, exa_api_key: str, openai_api_key: str):
        if not exa_api_key:
            raise ValueError("Exa API key is required")
        if not openai_api_key:
            raise ValueError("OpenAI API key is required")
            
        self.search = ExaOpSearch(exa_api_key)
        self.console = Console()
        
        try:
            self.llm = ChatOpenAI(
                temperature=Config.TEMPERATURE,
                model=Config.MODEL_NAME,
                openai_api_key=openai_api_key
            )
        except Exception as e:
            raise ValueError(f"Failed to initialize OpenAI client: {str(e)}")
        
        # Analysis prompt for individual sources
        self.analysis_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert analyst. Analyze this source and extract key information relevant to the question.
            Focus on factual information and provide a clear, concise analysis.
            
            Question: {question}
            
            Source Information:
            Title: {title}
            URL: {url}
            Summary: {summary}
            Key Points: {highlights}
            
            Provide a structured analysis with:
            1. Main Points
            2. Relevance to Query
            3. Key Takeaways"""),
            ("human", "What are the key insights from this source?")
        ])
        
        # Summary prompt for final answer
        self.summary_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a research analyst providing precise, factual answers based on the sources.
            Focus on accuracy and clarity. Be direct and concise.
            
            Question: {question}
            
            Analyzed Sources:
            {analyzed_sources}
            
            Guidelines for your response:
            1. 📍 Direct Answer: Provide a clear, concise answer in 1-2 sentences maximum. Focus only on the most important facts.
            2. 📚 Additional Context: Add 2-3 key supporting points from the sources, if relevant.
            
            Remember:
            - Be precise and factual
            - Avoid speculation or unsupported claims
            - Use clear, simple language
            - If there's uncertainty, state it clearly"""),
            ("human", "Provide a precise answer based on the sources.")
        ])

    def process_query(self, query: str) -> dict:
        try:
            # 1. Perform Exa search
            self.console.print(f"[blue]Searching for: {query}[/blue]")
            search_results = self.search.search_info(query)
            
            if search_results.get("error"):
                return {
                    "error": f"Search error: {search_results['error']}",
                    "search_results": None,
                    "analyses": None,
                    "final_answer": None
                }
            
            if not search_results or 'results' not in search_results:
                return {
                    "error": "No search results found",
                    "search_results": None,
                    "analyses": None,
                    "final_answer": None
                }
            
            # 2. Analyze each source with OpenAI
            analyses = []
            self.console.print("[blue]Analyzing sources...[/blue]")
            
            for source in search_results['results']:
                try:
                    # Prepare source info
                    source_info = {
                        "question": query,
                        "title": source.get('title', 'N/A'),
                        "url": source.get('url', 'N/A'),
                        "summary": source.get('summary', 'No summary available'),
                        "highlights": "\n".join(source.get('highlights', []))
                    }
                    
                    # Get analysis for this source
                    chain = self.analysis_prompt | self.llm
                    analysis = chain.invoke(source_info)
                    
                    analyses.append({
                        "source": source,
                        "analysis": analysis.content
                    })
                    self.console.print(f"[green]✓ Analyzed: {source_info['title']}[/green]")
                except Exception as e:
                    self.console.print(f"[yellow]Warning: Failed to analyze source {source.get('url')}: {str(e)}[/yellow]")
                    continue
            
            if not analyses:
                return {
                    "error": "Failed to analyze any sources",
                    "search_results": search_results['results'],
                    "analyses": None,
                    "final_answer": None
                }
            
            # 3. Generate final summary
            try:
                self.console.print("[blue]Generating final summary...[/blue]")
                analyzed_sources = "\n\n".join([
                    f"Source: {a['source']['title']}\nURL: {a['source']['url']}\nAnalysis: {a['analysis']}"
                    for a in analyses
                ])
                
                chain = self.summary_prompt | self.llm
                final_answer = chain.invoke({
                    "question": query,
                    "analyzed_sources": analyzed_sources
                })
                
                self.console.print("[green]✓ Analysis complete![/green]")
                return {
                    "error": None,
                    "search_results": search_results['results'],
                    "analyses": analyses,
                    "final_answer": final_answer.content
                }
            except Exception as e:
                return {
                    "error": f"Failed to generate final summary: {str(e)}",
                    "search_results": search_results['results'],
                    "analyses": analyses,
                    "final_answer": None
                }
            
        except Exception as e:
            self.console.print(f"[red]Error processing query: {str(e)}[/red]")
            return {
                "error": str(e),
                "search_results": None,
                "analyses": None,
                "final_answer": None
            }

def initialize_session_state():
    if 'messages' not in st.session_state:
        st.session_state.messages = []
    if 'chatbot' not in st.session_state:
        st.session_state.chatbot = ExaOpChatbot(
            Config.EXA_API_KEY,
            Config.OPENAI_API_KEY
        )

def display_response(response):
    """Display the response in a structured format"""
    if not response:
        st.error("No response received from the search")
        return
        
    if response.get("error"):
        st.error(f"Error: {response['error']}")
        return
    
    # Show final answer if available
    if response.get("final_answer"):
        st.markdown(response["final_answer"])
    
    # Show analyzed sources
    if response.get("analyses"):
        st.markdown("## 📚 Search Results")
        
        for idx, analysis in enumerate(response["analyses"], 1):
            source = analysis.get("source", {})
            
            # Create a container for each source
            with st.container():
                # Source title and URL with Twitter/X indicator
                st.markdown(f"### Source #{idx} {'🐦 Twitter/X' if source.get('source_type') == 'twitter' else ''}")
                st.markdown(f"**Title:** {source.get('title', 'No Title')}")
                
                # Format URL based on source type
                url = source.get('url', '#')
                if source.get('source_type') == 'twitter':
                    display_url = url.split('?')[0]  # Remove query parameters for display
                else:
                    display_url = url
                st.markdown(f"**URL:** [{display_url}]({url})")
                
                # Handle Twitter/X photos and other images
                images = []
                
                # Add Twitter photos if available
                if source.get('source_type') == 'twitter':
                    # Check tweet object first
                    tweet = source.get('tweet', {})
                    if tweet.get('photos'):
                        images.extend(tweet['photos'])
                    if tweet.get('media'):
                        for media in tweet['media']:
                            if isinstance(media, dict):
                                if media.get('type') == 'photo':
                                    images.append(media.get('url'))
                                elif media.get('type') == 'image':
                                    images.append(media.get('url'))
                    if tweet.get('images'):
                        for img in tweet['images']:
                            if isinstance(img, dict):
                                images.append(img.get('url'))
                            elif isinstance(img, str):
                                images.append(img)
                    
                    # Check source object as fallback
                    if source.get('photos'):
                        images.extend(source['photos'])
                    if source.get('media'):
                        for media in source['media']:
                            if isinstance(media, dict):
                                if media.get('type') == 'photo':
                                    images.append(media.get('url'))
                                elif media.get('type') == 'image':
                                    images.append(media.get('url'))
                
                # Add regular images
                if source.get('image'):
                    images.append(source['image'])
                if source.get('images'):
                    for img in source['images']:
                        if isinstance(img, dict):
                            images.append(img.get('url'))
                        elif isinstance(img, str):
                            images.append(img)
                
                # Remove duplicates while preserving order
                images = list(dict.fromkeys(images))
                
                # Display images
                if images:
                    st.markdown("#### 📸 Images")
                    cols = st.columns(min(len(images), 3))
                    for idx, img_url in enumerate(images[:3]):
                        if img_url and isinstance(img_url, str) and img_url.startswith(("http://", "https://")):
                            with cols[idx]:
                                try:
                                    st.image(img_url, use_column_width=True)
                                except Exception as e:
                                    st.warning(f"Unable to load image: {str(e)}")
                
                # AI Analysis
                st.markdown("#### 🤖 AI Analysis")
                st.markdown(analysis.get("analysis", "No analysis available"))
                
                # Source Highlights
                if source.get("highlights"):
                    with st.expander("📝 Source Highlights"):
                        for highlight in source["highlights"]:
                            st.markdown(f"• {highlight}")
                
                st.markdown("---")
    else:
        st.warning("No analyzed sources available")

def main():
    # Title and Description
    st.markdown("""
        <div class="title-container">
            <h1 class="title-text">🔍 ExaOp Search</h1>
            <p class="subtitle">Powered by Advanced Neural Search & AI Analysis</p>
        </div>
    """, unsafe_allow_html=True)
    
    initialize_session_state()
    
    # Chat interface
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            if message["role"] == "user":
                st.markdown(message["content"])
            else:
                display_response(message["response"])

    # Input
    if prompt := st.chat_input("Ask anything..."): # Updated placeholder
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            with st.spinner("🔍 Searching and analyzing..."):
                response = st.session_state.chatbot.process_query(prompt)
                display_response(response)
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": prompt,
                    "response": response
                })

if __name__ == "__main__":
    main() 