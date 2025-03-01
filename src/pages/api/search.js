const axios = require('axios');
const OpenAI = require('openai');
const { PromptTemplate } = require('@langchain/core/prompts');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Individual source analysis template
const SOURCE_ANALYSIS_TEMPLATE = `Analyze this source and provide 5 key insights in bullet points:

Source Title: {title}
Content: {content}

Provide exactly 5 bullet points, each under 15 words.`;

// Final summary template
const FINAL_SUMMARY_TEMPLATE = `Create a comprehensive research summary based on all analyzed sources:

Query: {query}
Analyzed Sources:
{sourceSummaries}

Provide:
1. Executive Summary (Write a detailed 200-word summary that comprehensively covers the main findings and insights)
2. Key Findings (5 bullet points highlighting the most important discoveries)
3. Source Analysis (brief note on source quality, relevance, and potential biases)
`;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract query from request body
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Get API keys from environment variables
  const exaApiKey = process.env.EXA_API_KEY;
  
  if (!exaApiKey) {
    return res.status(500).json({ 
      error: 'API key not configured',
      directAnswer: 'The search service is not properly configured.',
      sources: []
    });
  }

  try {
    // Increased timeout
    const timeout = 8000; // 8 seconds
    
    // Make request to Exa API with enhanced parameters
    const response = await axios.post('https://api.exa.ai/search', {
      query: query,
      numResults: parseInt(process.env.MAX_RESULTS || '5', 10),
      type: 'neural',
      includeDomains: [],
      excludeDomains: [],
      useAutoprompt: true,
      contents: {
        text: true,
        images: true,
        media: true,
        summary: true,
        highlights: true
      },
      social: {
        twitter: true
      }
    }, {
      headers: {
        'x-api-key': exaApiKey,
        'Content-Type': 'application/json'
      },
      timeout: timeout
    });
    
    // Extract and format results with enhanced processing
    const results = response.data.results || [];
    const formattedResults = results.map(result => ({
      url: result.url || '',
      title: result.title || 'No Title',
      text: result.text || '',
      summary: result.summary || '',
      highlights: result.highlights || [],
      images: result.images || [],
      media: result.media || [],
      isTwitter: result.url.includes('twitter.com') || result.url.includes('x.com'),
      timestamp: result.timestamp || new Date().toISOString()
    }));

    // Analyze each source individually
    const sourceAnalyses = await Promise.all(formattedResults.map(async (result) => {
      const sourcePrompt = new PromptTemplate({
        template: SOURCE_ANALYSIS_TEMPLATE,
        inputVariables: ['title', 'content']
      });

      const analysis = await openai.chat.completions.create({
        model: process.env.MODEL_NAME || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: await sourcePrompt.format({
              title: result.title,
              content: result.summary || result.text.slice(0, 500)
            })
          }
        ]
      });

      return {
        title: result.title,
        url: result.url,
        points: analysis.choices[0].message.content.split('\n')
          .filter(line => line.trim().startsWith('•'))
          .map(point => point.trim())
      };
    }));

    // Generate final comprehensive summary
    const finalPrompt = new PromptTemplate({
      template: FINAL_SUMMARY_TEMPLATE,
      inputVariables: ['query', 'sourceSummaries']
    });

    const finalAnalysis = await openai.chat.completions.create({
      model: process.env.MODEL_NAME || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: await finalPrompt.format({
            query: query,
            sourceSummaries: JSON.stringify(sourceAnalyses)
          })
        }
      ]
    });

    // Parse the final analysis
    const sections = finalAnalysis.choices[0].message.content.split('\n\n');
    const executiveSummary = sections.find(s => s.includes('Executive Summary'))?.split(':\n')[1] || '';
    const keyFindings = sections.find(s => s.includes('Key Findings'))?.split(':\n')[1].split('\n') || [];
    const sourceAnalysis = sections.find(s => s.includes('Source Analysis'))?.split(':\n')[1] || '';

    return res.status(200).json({
      error: null,
      query: query,
      executiveSummary,
      keyFindings: keyFindings.filter(f => f.trim().length > 0),
      sourceAnalysis,
      sources: sourceAnalyses
    });
    
  } catch (error) {
    console.error('Error in search API:', error);
    
    let errorMessage = 'An error occurred while processing your query';
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMessage = 'The request timed out. Please try a simpler query.';
    } else if (error.response) {
      if (error.response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.response.status === 401) {
        errorMessage = 'Invalid API key. Please check your configuration.';
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid request. Please try a different query.';
      } else {
        errorMessage = `External API error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`;
      }
      console.error('API Error Response:', error.response.data);
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      directAnswer: 'I encountered an error while processing your query.',
      sources: []
    });
  }
}
