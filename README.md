# ExaOp Search 🔍

A powerful AI-powered search application that combines neural search using Exa API with intelligent analysis using OpenAI GPT.

## Features ✨

- **Neural Search**: Advanced semantic search powered by Exa API
- **AI Analysis**: Intelligent content analysis using OpenAI GPT
- **Modern UI**: Clean, responsive chat interface with dark theme
- **Twitter/X Integration**: 
  - Seamless Twitter content integration
  - Display of Twitter photos and media
  - Special handling of Twitter URLs and content
- **Smart Summaries**: 
  - Precise, direct answers
  - Relevant supporting context
  - Source-based analysis
- **Media Support**:
  - Image display for articles and tweets
  - Support for multiple image formats
  - Responsive image grid layout

## Tech Stack 🛠️

- **Frontend**: Streamlit
- **Search Engine**: Exa API
- **AI Analysis**: OpenAI GPT
- **Language**: Python 3.8+

## Installation 📦

1. Clone the repository:
```bash
git clone <repository-url>
cd exaop
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables in `.env`:
```
EXA_API_KEY=your_exa_api_key
OPENAI_API_KEY=your_openai_api_key
MODEL_NAME=gpt-3.5-turbo
TEMPERATURE=0.7
MAX_RESULTS=20
```

## Usage 🚀

1. Start the application:
```bash
streamlit run app.py
```

2. Open your browser and navigate to:
```
http://localhost:8501
```

3. Enter your search query in the chat interface

## Project Structure 📁

```
exaop/
├── app.py              # Main Streamlit application
├── exaop.py           # Core search functionality
├── config.py          # Configuration settings
├── requirements.txt   # Project dependencies
├── .env              # Environment variables
└── README.md         # Documentation
```

## Features in Detail 🔎

### Search Capabilities
- Neural search for relevant content
- Twitter/X content integration
- Real-time content crawling
- Multi-source result aggregation

### AI Analysis
- Individual source analysis
- Comprehensive summary generation
- Key point extraction
- Relevance scoring

### User Interface
- Modern dark theme
- Chat-like interaction
- Responsive design
- Image grid display
- Twitter content formatting

### Content Display
- Direct, precise answers
- Source attribution
- Image support
- Twitter media integration
- Expandable highlights

## Environment Variables ⚙️

| Variable | Description | Default |
|----------|-------------|---------|
| EXA_API_KEY | Your Exa API key | Required |
| OPENAI_API_KEY | Your OpenAI API key | Required |
| MODEL_NAME | OpenAI model to use | gpt-3.5-turbo |
| TEMPERATURE | Model temperature | 0.7 |
| MAX_RESULTS | Maximum search results | 20 |

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## Acknowledgments 🙏

- Exa API for neural search capabilities
- OpenAI for GPT integration
- Streamlit for the web framework
