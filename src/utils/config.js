// Load environment variables
require('dotenv').config();

const Config = {
  // API Keys
  EXA_API_KEY: process.env.EXA_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // OpenAI Configuration
  MODEL_NAME: process.env.MODEL_NAME || 'gpt-3.5-turbo',
  TEMPERATURE: parseFloat(process.env.TEMPERATURE || '0.7'),
  
  // Search Configuration
  MAX_RESULTS: parseInt(process.env.MAX_RESULTS || '5', 10),
  
  // Validate configuration
  validate() {
    if (!this.EXA_API_KEY) {
      console.error('Error: EXA_API_KEY is not configured');
      return false;
    }
    
    if (!this.OPENAI_API_KEY) {
      console.error('Error: OPENAI_API_KEY is not configured');
      return false;
    }
    
    return true;
  }
};

module.exports = Config;
