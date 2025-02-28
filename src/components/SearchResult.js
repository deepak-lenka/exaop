export default function SearchResult({ result }) {
  // Handle null or undefined result
  if (!result) {
    return (
      <div className="error-container">
        <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
        <p className="text-white">No result data available</p>
      </div>
    );
  }

  const { directAnswer, context, sources, error } = result;

  if (error) {
    return (
      <div className="error-container">
        <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
        <p className="text-white">{error}</p>
        {directAnswer && (
          <div className="mt-4">
            <p className="text-white">{directAnswer}</p>
          </div>
        )}
        {context && (
          <div className="mt-2">
            <p className="text-gray-400">{context}</p>
          </div>
        )}
      </div>
    );
  }

  // Handle missing directAnswer
  if (!directAnswer) {
    return (
      <div className="error-container">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">No Results</h3>
        <p className="text-white">No answer could be generated for this query. Please try a different search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="result-card">
        <div className="result-header">
          <div className="result-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </div>
          <h3 className="section-title">AI-Generated Answer</h3>
        </div>
        <div className="direct-answer">{directAnswer}</div>
        
        {context && (
          <div className="mt-6">
            <h4 className="section-subtitle">Additional Context</h4>
            <p className="text-gray-200 leading-relaxed">{context}</p>
          </div>
        )}
      </div>

      {sources && sources.length > 0 ? (
        <>
          <div className="sources-header">
            <div className="sources-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            </div>
            <h3 className="section-title">Sources</h3>
          </div>
          
          <div className="sources-grid">
            {sources.map((source, index) => (
              <div key={index} className="source-card">
                <div className="source-header">
                  <span className="source-number">{index + 1}</span>
                  <h4 className="source-title">{source.title || 'No Title'}</h4>
                </div>
                
                <div className="source-content">
                  {source.summary && (
                    <div className="mb-4">
                      <h5 className="source-subtitle">Summary</h5>
                      <p className="source-text">{source.summary}</p>
                    </div>
                  )}
                  
                  {source.highlights && (
                    <div className="mb-4">
                      <h5 className="source-subtitle">Key Points</h5>
                      <p className="source-text">{source.highlights}</p>
                    </div>
                  )}
                  
                  {source.analysis && (
                    <div>
                      <h5 className="source-subtitle">Analysis</h5>
                      <p className="source-text">{source.analysis}</p>
                    </div>
                  )}
                </div>
                
                <div className="source-footer">
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    View Source
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-sources">
          <p>No sources available for this query.</p>
        </div>
      )}
    </div>
  );
}
