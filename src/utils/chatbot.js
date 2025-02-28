const { OpenAI } = require('openai');
const Exaop = require('./exaop');
const Config = require('./config');

class Chatbot {
  constructor(openaiApiKey, exaApiKey) {
    this.exaApiKey = exaApiKey;
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    this.search = new Exaop(exaApiKey);
    
    try {
      // Use the official OpenAI client instead of LangChain
      this.openai = new OpenAI({
        apiKey: openaiApiKey,
      });
      
      this.modelName = Config.MODEL_NAME || 'gpt-3.5-turbo';
      this.temperature = Config.TEMPERATURE || 0.7;
    } catch (error) {
      console.error('Error initializing OpenAI:', error);
      this.openai = null;
    }
  }

  async generateSummary(query, searchResults) {
    /**
     * Generate a summary of search results using OpenAI - simplified version to avoid timeouts
     */
    if (!this.openai) {
      console.error('Error: OpenAI API key is not configured');
      return {
        error: 'OpenAI API key is not configured',
        summary: null
      };
    }

    // If there are no search results or an error occurred
    if (!searchResults || searchResults.length === 0) {
      return {
        error: 'No search results to summarize',
        summary: null
      };
    }

    try {
      // Extremely simplified processing - only take first result
      const firstResult = searchResults[0];
      
      // Create a very simple prompt
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes web search results.'
        },
        {
          role: 'user',
          content: `Summarize this information about "${query}":\n\n${firstResult.text.substring(0, 300)}`
        }
      ];

      // Set up a timeout for OpenAI request
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OpenAI request timed out')), 5000);
      });

      // Make the OpenAI request with minimal parameters
      const openAIPromise = this.openai.chat.completions.create({
        model: this.modelName,
        messages: messages,
        temperature: 0.3, // Lower temperature for more deterministic results
        max_tokens: 150, // Very limited response
      });

      // Race between the OpenAI request and the timeout
      const response = await Promise.race([openAIPromise, timeoutPromise]);

      // Extract and return the summary
      const summary = response.choices[0].message.content;
      
      return {
        error: null,
        summary
      };
    } catch (error) {
      console.error('Error generating summary with OpenAI:', error);
      
      // Enhanced error handling
      let errorMessage = 'Error generating summary';
      
      if (error.message.includes('timed out')) {
        errorMessage = 'Summary generation timed out';
      } else if (error.response) {
        errorMessage += `: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`;
      } else {
        errorMessage += `: ${error.message}`;
      }
      
      return {
        error: errorMessage,
        summary: `I couldn't generate a summary for "${query}" due to a technical issue. Please try again with a simpler query.`
      };
    }
  }

  async processQuery(query) {
    /**
     * Process a query through Exa search and OpenAI summary
     * Simplified to avoid timeouts
     */
    try {
      // Step 1: Search with Exa
      console.log('Searching with Exa for:', query);
      const searchResponse = await this.search.searchInfo(query);
      
      if (searchResponse.error) {
        console.error('Error from Exa search:', searchResponse.error);
        return {
          error: searchResponse.error,
          directAnswer: `I encountered an error while searching for information about "${query}".`,
          context: 'Error in search process',
          sources: []
        };
      }
      
      const results = searchResponse.results || [];
      
      if (results.length === 0) {
        return {
          error: null,
          directAnswer: `I couldn't find any information about "${query}". Please try a different query.`,
          context: 'No results found',
          sources: []
        };
      }
      
      // Step 2: Generate summary with OpenAI
      console.log('Generating summary with OpenAI');
      const summaryResponse = await this.generateSummary(query, results);
      
      return {
        error: null,
        directAnswer: summaryResponse.summary || `Found ${results.length} results for "${query}"`,
        context: 'Based on web search results',
        sources: results
      };
      
    } catch (error) {
      console.error('Error processing query:', error);
      
      return {
        error: `Error processing query: ${error.message}`,
        directAnswer: `I encountered an error while processing your query about "${query}".`,
        context: 'Error in processing',
        sources: []
      };
    }
  }
}

module.exports = Chatbot;
