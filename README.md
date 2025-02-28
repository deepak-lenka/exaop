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

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Search Engine**: Exa API
- **AI Analysis**: OpenAI GPT
- **Deployment**: Vercel

## Installation 📦

1. Clone the repository:
```bash
git clone <repository-url>
cd exaop-node
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file based on `.env.example`
   - Add your Exa API key and OpenAI API key

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment to Vercel 🚀

This project is configured for easy deployment to Vercel.

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Set up environment variables in the Vercel dashboard:
   - EXA_API_KEY
   - OPENAI_API_KEY
   - MODEL_NAME (optional)
   - TEMPERATURE (optional)
   - MAX_RESULTS (optional)

## Project Structure 📂

```
exaop-node/
├── public/             # Static files
├── src/
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   │   ├── api/        # API routes
│   │   └── index.js    # Home page
│   ├── styles/         # CSS styles
│   └── utils/          # Utility functions
├── .env.example        # Example environment variables
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies and scripts
├── vercel.json         # Vercel deployment configuration
└── README.md           # Project documentation
```

## License 📄

MIT

## Acknowledgements 🙏

- [Exa API](https://exa.ai) for providing the neural search capabilities
- [OpenAI](https://openai.com) for the GPT models used in analysis
- [Next.js](https://nextjs.org) for the React framework
- [Vercel](https://vercel.com) for hosting and deployment
