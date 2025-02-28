import React, { useState, useEffect } from 'react';

export default function SearchProgress({ stage, searchQuery }) {
  // Search stages
  const stages = [
    { 
      id: 'searching', 
      label: 'Searching the web', 
      icon: 'globe',
      details: [
        'Crawling multiple sources',
        'Finding relevant content',
        'Extracting key information'
      ]
    },
    { 
      id: 'analyzing', 
      label: 'Analyzing sources', 
      icon: 'document-text',
      details: [
        'Evaluating source credibility',
        'Extracting key insights',
        'Comparing information across sources'
      ]
    },
    { 
      id: 'generating', 
      label: 'Generating insights', 
      icon: 'sparkles',
      details: [
        'Synthesizing information',
        'Creating comprehensive summary',
        'Formatting results for clarity'
      ]
    }
  ];

  // Find current stage index
  const currentStageIndex = stages.findIndex(s => s.id === stage);
  
  // Random facts to display during search
  const [fact, setFact] = useState('');
  const facts = [
    "Exaop.AI searches across thousands of sources in real-time",
    "Our neural search technology understands context, not just keywords",
    "Exaop.AI can analyze Twitter/X posts for the latest information",
    "We extract and analyze images to provide comprehensive results",
    "Exaop.AI uses advanced AI to summarize complex information"
  ];
  
  // Rotate through facts every few seconds
  useEffect(() => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setFact(randomFact);
    
    const factInterval = setInterval(() => {
      const newFact = facts[Math.floor(Math.random() * facts.length)];
      setFact(newFact);
    }, 5000);
    
    return () => clearInterval(factInterval);
  }, []);
  
  return (
    <div className="search-progress-container">
      <h3 className="search-progress-title">Researching: <span className="search-query-text">"{searchQuery}"</span></h3>
      
      <div className="search-stages">
        {stages.map((s, index) => (
          <div 
            key={s.id} 
            className={`search-stage ${index <= currentStageIndex ? 'active' : ''} ${index < currentStageIndex ? 'completed' : ''}`}
          >
            <div className="stage-icon">
              {s.icon === 'globe' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              )}
              {s.icon === 'document-text' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              )}
              {s.icon === 'sparkles' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              )}
            </div>
            <div className="stage-content">
              <div className="stage-label">{s.label}</div>
              
              {index === currentStageIndex && (
                <>
                  <div className="stage-details">
                    {s.details.map((detail, i) => (
                      <div key={i} className="stage-detail-item">
                        <div className="detail-bullet"></div>
                        <div className="detail-text">{detail}</div>
                      </div>
                    ))}
                  </div>
                  <div className="stage-animation">
                    <div className="dot-pulse"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="search-tips">
        <div className="tip-item">
          <div className="tip-icon">💡</div>
          <div className="tip-text">{fact}</div>
        </div>
      </div>
    </div>
  );
}
