// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');

// Extremely simplified search API to avoid timeouts
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
    
    // Make a direct request to Exa API with minimal parameters
    const response = await axios.post('https://api.exa.ai/search', {
      query: query,
      useAutoprompt: false,
      type: 'neural',
      numResults: 5,
      contents: {
        text: { maxCharacters: 300, includeHtmlTags: false },
        images: { enabled: false },
        media: { enabled: false },
        summary: { enabled: false },
        highlights: { enabled: false }
      }
    }, {
      headers: {
        'x-api-key': exaApiKey,
        'Content-Type': 'application/json'
      },
      timeout: timeout
    });
    
    // Extract and format results with minimal processing
    const results = response.data.results || [];
    const formattedResults = results.map(result => ({
      url: result.url || '',
      title: result.title || 'No Title',
      text: result.text?.substring(0, 300) || '',
      timestamp: new Date().toISOString()
    }));
    
    // Return simplified response without OpenAI processing
    return res.status(200).json({
      error: null,
      directAnswer: `Found ${formattedResults.length} results for "${query}"`,
      sources: formattedResults
    });
    
  } catch (error) {
    console.error('Error in search API:', error);
    
    let errorMessage = 'An error occurred while processing your query';
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMessage = 'The request timed out. Please try a simpler query.';
    } else if (error.response) {
      errorMessage = `External API error: ${error.response.status}`;
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      directAnswer: 'I encountered an error while processing your query.',
      sources: []
    });
  }
}
