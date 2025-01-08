 # ExaOp Search 🔍

ExaOp Search is an advanced AI-powered search application that combines neural search technology with AI analysis to provide comprehensive and insightful answers to your queries.

## Features

- 🧠 Neural Search: Advanced semantic understanding of queries
- 🌐 Global Search: Searches across the entire internet without domain restrictions
- 🖼️ Visual Content: Automatically extracts and displays relevant images
- 🤖 AI Analysis: Provides intelligent analysis of search results
- 📊 Multi-Source Analysis: Synthesizes information from multiple sources

## Tech Stack

- **Frontend**: Streamlit
- **Search Engine**: Exa API
- **AI Analysis**: OpenAI GPT
- **Language**: Python 3.12+

## Installation

1. Clone the repository:
```bash
git clone https://github.com/deepak-lenka/exaop.git
cd exaop
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the project root and add your API keys:
```env
EXA_API_KEY=your_exa_api_key
OPENAI_API_KEY=your_openai_api_key
MODEL_NAME=gpt-3.5-turbo
TEMPERATURE=0.7
MAX_RESULTS=20
```

## Usage

1. Start the application:
```bash
streamlit run app.py
```

2. Open your browser and navigate to `http://localhost:8501`

3. Enter your query in the chat input and press Enter

## Project Structure

```
exaop/
├── app.py              # Main Streamlit application
├── exaop.py           # ExaOp search implementation
├── config.py          # Configuration and environment setup
├── requirements.txt   # Project dependencies
├── .env              # Environment variables (not tracked)
└── README.md         # Project documentation
```

## Environment Variables

- `EXA_API_KEY`: Your Exa API key for search functionality
- `OPENAI_API_KEY`: Your OpenAI API key for AI analysis
- `MODEL_NAME`: OpenAI model to use (default: gpt-3.5-turbo)
- `TEMPERATURE`: Model temperature setting (default: 0.7)
- `MAX_RESULTS`: Maximum number of search results (default: 20)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Exa API](https://exa.ai) for providing powerful search capabilities
- [OpenAI](https://openai.com) for AI analysis
- [Streamlit](https://streamlit.io) for the web interface
