import React from 'react';

const AnalysisCard = ({ analysis }) => {
  if (!analysis) return null;

  // Parse the analysis response into sections
  const sections = analysis.split('\n').reduce((acc, line) => {
    if (line.startsWith('- Direct Answer:')) {
      acc.directAnswer = line.replace('- Direct Answer:', '').trim();
    } else if (line.startsWith('- Context:')) {
      acc.context = line.replace('- Context:', '').trim();
    } else if (line.startsWith('- Source Analysis:')) {
      acc.sourceAnalysis = line.replace('- Source Analysis:', '').trim();
    }
    return acc;
  }, {});

  return (
    <div className="analysis-card">
      <div className="analysis-section">
        <h3 className="section-title">Direct Answer</h3>
        <p className="section-content">{sections.directAnswer}</p>
      </div>
      
      <div className="analysis-section">
        <h3 className="section-title">Context & Insights</h3>
        <p className="section-content">{sections.context}</p>
      </div>
      
      <div className="analysis-section">
        <h3 className="section-title">Source Analysis</h3>
        <p className="section-content">{sections.sourceAnalysis}</p>
      </div>
    </div>
  );
};

export default AnalysisCard;
