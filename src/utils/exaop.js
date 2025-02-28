const axios = require('axios');

/**
 * ExaOP class for interacting with the Exa API
 */
class ExaOP {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.exa.ai';
  }

  /**
   * Search the Exa API with the given query
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} - Search results
   */
  async search(query, options = {}) {
    if (!this.apiKey) {
      throw new Error('Exa API key is not configured');
    }

    try {
      const maxResults = options.maxResults || 5; // Default to 5 results
      const timeout = options.timeout || 8000; // Default to 8 seconds

      // Configure search parameters
      const searchParams = {
        query,
        useAutoprompt: true,
        type: 'neural',
        numResults: maxResults,
        contents: {
          text: { 
            maxCharacters: 800, 
            includeHtmlTags: false 
          },
          images: { enabled: false },
          media: { enabled: false },
          summary: { 
            enabled: true,
            query: `Summarize information about ${query}`
          },
          highlights: { 
            enabled: true,
            numSentences: 1,
            highlightsPerUrl: 1
          }
        }
      };

      // Make the API request
      const response = await axios.post(
        `${this.baseUrl}/search`,
        searchParams,
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          timeout
        }
      );

      // Process and return the results
      return this.processResults(response.data);
    } catch (error) {
      console.error('Error searching Exa API:', error);
      
      let errorMessage = 'Error searching Exa API';
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Exa API request timed out';
      } else if (error.response) {
        errorMessage = `Exa API error: ${error.response.status}`;
      } else {
        errorMessage = `Exa API error: ${error.message}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Process the search results
   * @param {Object} data - The raw API response data
   * @returns {Object} - Processed results
   */
  processResults(data) {
    if (!data || !data.results || !Array.isArray(data.results)) {
      return { results: [] };
    }

    // Format the results
    const formattedResults = data.results.map(result => ({
      url: result.url || '',
      title: result.title || 'No Title',
      text: result.text || '',
      summary: result.summary?.text || '',
      highlights: result.highlights?.map(h => h.text).join('\n') || '',
      timestamp: new Date().toISOString()
    }));

    return { results: formattedResults };
  }
}

module.exports = ExaOP;
