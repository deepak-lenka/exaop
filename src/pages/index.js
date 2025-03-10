import { useState, useEffect } from 'react';
import Head from 'next/head';
import SearchForm from '../components/SearchForm';
import SearchResult from '../components/SearchResult';
import SearchProgress from '../components/SearchProgress';
import ChatSidebar from '../components/ChatSidebar';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStage, setSearchStage] = useState('searching');
  const [showHeader, setShowHeader] = useState(true);

  const currentChat = chatHistory.find(chat => chat.id === currentChatId);
  const currentResults = currentChat?.results || [];

  // Simulate search progress stages
  useEffect(() => {
    if (isLoading) {
      // Start with searching stage
      setSearchStage('searching');
      
      // After 2 seconds, move to analyzing stage
      const analyzeTimer = setTimeout(() => {
        setSearchStage('analyzing');
      }, 2000);
      
      // After 5 seconds, move to generating stage
      const generateTimer = setTimeout(() => {
        setSearchStage('generating');
      }, 5000);
      
      return () => {
        clearTimeout(analyzeTimer);
        clearTimeout(generateTimer);
      };
    }
  }, [isLoading]);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setSearchQuery(query);
    setShowHeader(false);
    // Keep previous results
    
    try {
      console.log('Sending search request for:', query);
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      console.log('Response status:', response.status);
      
      // Try to get the response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Then parse it as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error(`Failed to parse response as JSON: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during search');
      }
      
      const newResult = data;
      if (currentChatId) {
        // Add to existing chat
        setChatHistory(prevHistory => 
          prevHistory.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, results: [newResult, ...chat.results] }
              : chat
          )
        );
      } else {
        // Create new chat
        const newChatId = Date.now().toString();
        const newChat = {
          id: newChatId,
          query: query,
          results: [newResult],
          timestamp: new Date().toISOString()
        };
        setChatHistory(prevHistory => [newChat, ...prevHistory]);
        setCurrentChatId(newChatId);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      const errorResult = { 
        error: err.message,
        directAnswer: "I encountered an error while processing your query.",
        context: "There was a problem with the search service. Please try again later.",
        sources: []
      };
      if (currentChatId) {
        setChatHistory(prevHistory => 
          prevHistory.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, results: [errorResult, ...chat.results] }
              : chat
          )
        );
      } else {
        const newChatId = Date.now().toString();
        const newChat = {
          id: newChatId,
          query: query,
          results: [errorResult],
          timestamp: new Date().toISOString()
        };
        setChatHistory(prevHistory => [newChat, ...prevHistory]);
        setCurrentChatId(newChatId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Head>
        <title>Exaop.AI</title>
        <meta name="description" content="AI-powered research platform combining neural search with intelligent analysis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ChatSidebar 
        className="app-sidebar"
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onNewChat={() => {
          setCurrentChatId(null);
          setSearchQuery('');
          setShowHeader(true);
        }}
        onSelectChat={(chatId) => {
          setCurrentChatId(chatId);
          const chat = chatHistory.find(c => c.id === chatId);
          setSearchQuery(chat.query);
        }}
      />
      
      <div className="main-wrapper">
        <main className="main-content relative min-h-screen">
        <div className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 backdrop-blur-sm pt-8 pb-4 px-4 border-b border-gray-800">
          {showHeader && (
            <div className="hero-section mb-4">
              <h1 className="app-title">Exaop.AI</h1>
              <p className="app-description">
                Advanced neural search platform with AI-powered analysis and insights
              </p>
            </div>
          )}
          <div className="search-section">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        <div className="content-area px-4 py-8 mt-4">
          {error && !searchResult && (
            <div className="error-container">
              <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
              <p className="text-white">{error}</p>
            </div>
          )}
          
          {isLoading && (
            <SearchProgress stage={searchStage} searchQuery={searchQuery} />
          )}
          
          {currentResults.map((result, index) => (
            <div key={index} className="mb-12 border-b border-gray-800 pb-8 last:border-b-0">
              <SearchResult result={result} />
            </div>
          ))}
          
          {currentResults.length === 0 && !error && !isLoading && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div className="empty-state-examples">
                <p className="text-sm text-gray-400 mb-3">Try searching for:</p>
                <div className="example-queries">
                  <button 
                    onClick={() => handleSearch("Latest advancements in quantum computing")}
                    className="example-query-button"
                  >
                    Latest advancements in quantum computing
                  </button>
                  <button 
                    onClick={() => handleSearch("Climate change impact on agriculture")}
                    className="example-query-button"
                  >
                    Climate change impact on agriculture
                  </button>
                  <button 
                    onClick={() => handleSearch("AI ethics and regulation developments")}
                    className="example-query-button"
                  >
                    AI ethics and regulation developments
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Powered by{' '}
          <a href="https://exa.ai" target="_blank" rel="noopener noreferrer" className="footer-link">
            Exa AI
          </a>{' '}
          and{' '}
          <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            OpenAI
          </a>
        </p>
      </footer>
      </div>
    </div>
  );
}
