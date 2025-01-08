import streamlit as st
from exaop import ExaOpSearch
from config import Config
from rich.console import Console
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

st.set_page_config(
    page_title="ExaOp Search",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Apply custom CSS
st.markdown("""
<style>
    .search-result {
        background-color: #2D2D2D;
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
    }
    .analysis-box {
        background-color: #363636;
        padding: 15px;
        border-radius: 10px;
        margin: 10px 0;
        border-left: 4px solid #00A6ED;
    }
    .source-link {
        color: #00A6ED !important;
        text-decoration: none;
    }
    .highlight {
        background-color: #404040;
        padding: 10px;
        border-radius: 5px;
        margin: 5px 0;
    }
    /* Control image size */
    .stImage > img {
        max-height: 300px !important;
        object-fit: contain;
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
            ("system", """Analyze this source and extract key information relevant to the question.
            
            Question: {question}
            
            Source Information:
            Title: {title}
            URL: {url}
            Summary: {summary}
            Key Points: {highlights}
            
            Provide a concise analysis focusing on how this source answers the question."""),
            ("human", "What relevant information does this source provide?")
        ])
        
        # Summary prompt for final answer
        self.summary_prompt = ChatPromptTemplate.from_messages([
            ("system", """Based on all the analyzed sources, provide a comprehensive answer to the question.
            
            Question: {question}
            
            Analyzed Sources:
            {analyzed_sources}
            
            Format your response as:
            📍 Direct Answer: [clear, concise answer]
            📚 Additional Context: [important details]"""),
            ("human", "Provide a comprehensive answer based on the sources.")
        ])

    def process_query(self, query: str) -> dict:
        try:
            # 1. Perform Exa search
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
            
            # 2. Analyze each source
            analyses = []
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
                analyzed_sources = "\n\n".join([
                    f"Source: {a['source']['title']}\nAnalysis: {a['analysis']}"
                    for a in analyses
                ])
                
                chain = self.summary_prompt | self.llm
                final_answer = chain.invoke({
                    "question": query,
                    "analyzed_sources": analyzed_sources
                })
                
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
    if response["error"]:
        st.error(response["error"])
        return
    
    # Show final answer
    st.markdown(response["final_answer"])
    
    # Show analyzed sources
    st.markdown("### 📚 Source Analysis")
    
    for analysis in response["analyses"]:
        source = analysis["source"]
        
        # Create a clean container for each source
        with st.container():
            # Source title and date
            st.markdown(
                f"### [{source.get('title', 'No Title')}]({source.get('url', '#')})"
            )
            st.markdown(f"Published: {source.get('publishedDate', 'N/A')[:10]}")
            
            # Handle images first
            images = []
            if source.get('image'):
                images.append(source['image'])
            if source.get('images'):
                for img in source['images']:
                    if isinstance(img, dict):
                        images.append(img.get('url'))
                    else:
                        images.append(img)
            
            # Display images if available
            if images:
                cols = st.columns(min(len(images), 3))
                for idx, img_url in enumerate(images[:3]):
                    if img_url and isinstance(img_url, str) and img_url.startswith(('http://', 'https://')):
                        with cols[idx]:
                            try:
                                st.image(img_url, width=250)
                            except:
                                pass
                st.markdown("---")
            
            # AI Analysis
            with st.expander("🤖 AI Analysis", expanded=True):
                st.markdown(analysis['analysis'])
            
            # Source Highlights
            if source.get('highlights'):
                with st.expander("📝 Source Highlights", expanded=False):
                    for highlight in source['highlights']:
                        st.markdown(f"• {highlight}")
            
            st.markdown("---")

def main():
    # Add custom CSS for better styling
    st.markdown("""
        <style>
        /* Main container */
        .main {
            background-color: #1E1E1E;
        }
        
        /* Headers */
        h1, h2, h3 {
            color: #FFFFFF !important;
            margin-bottom: 0.5em;
        }
        
        /* Links */
        a {
            color: #00A6ED !important;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        
        /* Expander styling */
        .streamlit-expanderHeader {
            background-color: #2D2D2D;
            border-radius: 5px;
        }
        
        /* Divider */
        hr {
            margin: 2em 0;
            border-color: #404040;
        }
        
        /* Chat message container */
        .stChatMessage {
            background-color: #2D2D2D;
            border-radius: 10px;
            padding: 1em;
            margin: 0.5em 0;
        }
        </style>
    """, unsafe_allow_html=True)
    
    # Title and Description
    st.markdown('<div class="title-container">', unsafe_allow_html=True)
    st.title("🔍 ExaOp Search")
    st.markdown('<p class="subtitle">Powered by Advanced Neural Search & AI Analysis</p>', unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
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